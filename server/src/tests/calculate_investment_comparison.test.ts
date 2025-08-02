
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { investmentComparisonsTable } from '../db/schema';
import { type InvestmentComparisonInput } from '../schema';
import { calculateInvestmentComparison } from '../handlers/calculate_investment_comparison';
import { eq } from 'drizzle-orm';

// Test input with realistic values
const testInput: InvestmentComparisonInput = {
  comparison_period_years: 10,
  
  // Rental property parameters
  property_price: 500000,
  down_payment_percentage: 20,
  mortgage_interest_rate: 6.5,
  mortgage_term_years: 30,
  monthly_rent: 3000,
  annual_rent_increase_rate: 3,
  annual_property_appreciation_rate: 4,
  monthly_maintenance_cost: 200,
  annual_property_tax_rate: 1.2,
  annual_insurance_cost: 1500,
  vacancy_rate_percentage: 5,
  closing_costs: 15000,
  selling_costs_percentage: 6,
  
  // ETF parameters
  etf_annual_return_rate: 8,
  etf_annual_fee_rate: 0.1
};

describe('calculateInvestmentComparison', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should calculate and save investment comparison', async () => {
    const result = await calculateInvestmentComparison(testInput);

    // Verify basic structure
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    
    // Verify input parameters are preserved
    expect(result.comparison_period_years).toEqual(10);
    expect(result.property_price).toEqual(500000);
    expect(result.down_payment_percentage).toEqual(20);
    expect(result.etf_annual_return_rate).toEqual(8);
    
    // Verify calculated results are numbers
    expect(typeof result.rental_initial_investment).toBe('number');
    expect(typeof result.rental_total_cash_flow).toBe('number');
    expect(typeof result.rental_total_profit).toBe('number');
    expect(typeof result.etf_final_value).toBe('number');
    expect(typeof result.etf_total_profit).toBe('number');
    expect(typeof result.profit_difference).toBe('number');
    
    // Verify investment choice is valid
    expect(['rental', 'etf']).toContain(result.better_investment);
  });

  it('should save comparison to database', async () => {
    const result = await calculateInvestmentComparison(testInput);

    // Query database to verify save
    const saved = await db.select()
      .from(investmentComparisonsTable)
      .where(eq(investmentComparisonsTable.id, result.id))
      .execute();

    expect(saved).toHaveLength(1);
    const savedRecord = saved[0];
    
    // Verify input parameters are saved correctly
    expect(parseFloat(savedRecord.property_price)).toEqual(500000);
    expect(parseFloat(savedRecord.down_payment_percentage)).toEqual(20);
    expect(savedRecord.comparison_period_years).toEqual(10);
    
    // Verify calculated results are saved
    expect(parseFloat(savedRecord.rental_initial_investment)).toBeGreaterThan(0);
    expect(parseFloat(savedRecord.etf_final_value)).toBeGreaterThan(0);
    expect(savedRecord.better_investment).toMatch(/^(rental|etf)$/);
  });

  it('should calculate rental initial investment correctly', async () => {
    const result = await calculateInvestmentComparison(testInput);

    // Down payment: 500000 * 0.20 = 100000
    // Closing costs: 15000
    // Expected initial investment: 115000
    expect(result.rental_initial_investment).toEqual(115000);
    expect(result.etf_initial_investment).toEqual(115000);
  });

  it('should handle property appreciation correctly', async () => {
    const highAppreciationInput: InvestmentComparisonInput = {
      ...testInput,
      annual_property_appreciation_rate: 10, // High appreciation
      comparison_period_years: 5
    };

    const result = await calculateInvestmentComparison(highAppreciationInput);
    
    // With 10% appreciation over 5 years: 500000 * (1.10)^5 ≈ 805255
    expect(result.rental_property_value_at_end).toBeGreaterThan(800000);
    expect(result.rental_property_value_at_end).toBeLessThan(810000);
  });

  it('should handle ETF compound growth correctly', async () => {
    const simpleInput: InvestmentComparisonInput = {
      ...testInput,
      etf_annual_return_rate: 10,
      etf_annual_fee_rate: 0,
      comparison_period_years: 5
    };

    const result = await calculateInvestmentComparison(simpleInput);
    
    // With 10% return and no fees over 5 years: 115000 * (1.10)^5 ≈ 185263
    expect(result.etf_final_value).toBeGreaterThan(185000);
    expect(result.etf_final_value).toBeLessThan(186000);
  });

  it('should account for vacancy rate in rental calculations', async () => {
    const noVacancyInput: InvestmentComparisonInput = {
      ...testInput,
      vacancy_rate_percentage: 0
    };

    const highVacancyInput: InvestmentComparisonInput = {
      ...testInput,
      vacancy_rate_percentage: 20
    };

    const noVacancyResult = await calculateInvestmentComparison(noVacancyInput);
    const highVacancyResult = await calculateInvestmentComparison(highVacancyInput);

    // Higher vacancy should result in lower cash flow
    expect(noVacancyResult.rental_total_cash_flow).toBeGreaterThan(highVacancyResult.rental_total_cash_flow);
  });

  it('should calculate annualized returns correctly', async () => {
    const result = await calculateInvestmentComparison(testInput);

    // Annualized returns should be reasonable percentages
    expect(result.rental_annualized_return).toBeGreaterThan(-50);
    expect(result.rental_annualized_return).toBeLessThan(50);
    expect(result.etf_annualized_return).toBeGreaterThan(-50);
    expect(result.etf_annualized_return).toBeLessThan(50);
  });

  it('should handle negative appreciation rates', async () => {
    const negativeAppreciationInput: InvestmentComparisonInput = {
      ...testInput,
      annual_property_appreciation_rate: -2, // Property loses value
      comparison_period_years: 5
    };

    const result = await calculateInvestmentComparison(negativeAppreciationInput);
    
    // Property should be worth less than original price
    expect(result.rental_property_value_at_end).toBeLessThan(testInput.property_price);
    expect(result.rental_total_profit).toBeDefined();
  });

  it('should determine better investment correctly', async () => {
    const result = await calculateInvestmentComparison(testInput);

    // The better investment should have higher total profit
    if (result.better_investment === 'rental') {
      expect(result.rental_total_profit).toBeGreaterThanOrEqual(result.etf_total_profit);
    } else {
      expect(result.etf_total_profit).toBeGreaterThanOrEqual(result.rental_total_profit);
    }

    // Profit difference should match the absolute difference
    const expectedDifference = Math.abs(result.rental_total_profit - result.etf_total_profit);
    expect(Math.abs(result.profit_difference - expectedDifference)).toBeLessThan(0.01);
  });
});
