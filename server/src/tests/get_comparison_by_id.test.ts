
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { investmentComparisonsTable } from '../db/schema';
import { type GetComparisonInput } from '../schema';
import { getComparisonById } from '../handlers/get_comparison_by_id';

// Test data for creating a comparison
const testComparisonData = {
  comparison_period_years: 10,
  property_price: '500000.00',
  down_payment_percentage: '20.00',
  mortgage_interest_rate: '4.50',
  mortgage_term_years: 30,
  monthly_rent: '3500.00',
  annual_rent_increase_rate: '3.00',
  annual_property_appreciation_rate: '5.00',
  monthly_maintenance_cost: '500.00',
  annual_property_tax_rate: '1.20',
  annual_insurance_cost: '1200.00',
  vacancy_rate_percentage: '5.00',
  closing_costs: '15000.00',
  selling_costs_percentage: '6.00',
  etf_annual_return_rate: '8.00',
  etf_annual_fee_rate: '0.50',
  
  rental_initial_investment: '115000.00',
  rental_total_cash_flow: '250000.00',
  rental_property_value_at_end: '814447.31',
  rental_total_profit: '699447.31',
  rental_annualized_return: '16.8500',
  
  etf_initial_investment: '115000.00',
  etf_final_value: '242712.85',
  etf_total_profit: '127712.85',
  etf_annualized_return: '7.7500',
  
  better_investment: 'rental',
  profit_difference: '571734.46'
};

describe('getComparisonById', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return a comparison by ID', async () => {
    // Create a test comparison
    const insertResult = await db.insert(investmentComparisonsTable)
      .values(testComparisonData)
      .returning()
      .execute();

    const createdComparison = insertResult[0];
    const input: GetComparisonInput = { id: createdComparison.id };

    const result = await getComparisonById(input);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdComparison.id);
    
    // Verify input parameters
    expect(result!.comparison_period_years).toEqual(10);
    expect(result!.property_price).toEqual(500000);
    expect(result!.down_payment_percentage).toEqual(20);
    expect(result!.mortgage_interest_rate).toEqual(4.5);
    expect(result!.mortgage_term_years).toEqual(30);
    expect(result!.monthly_rent).toEqual(3500);
    expect(result!.annual_rent_increase_rate).toEqual(3);
    expect(result!.annual_property_appreciation_rate).toEqual(5);
    expect(result!.monthly_maintenance_cost).toEqual(500);
    expect(result!.annual_property_tax_rate).toEqual(1.2);
    expect(result!.annual_insurance_cost).toEqual(1200);
    expect(result!.vacancy_rate_percentage).toEqual(5);
    expect(result!.closing_costs).toEqual(15000);
    expect(result!.selling_costs_percentage).toEqual(6);
    expect(result!.etf_annual_return_rate).toEqual(8);
    expect(result!.etf_annual_fee_rate).toEqual(0.5);
    
    // Verify calculated results
    expect(result!.rental_initial_investment).toEqual(115000);
    expect(result!.rental_total_cash_flow).toEqual(250000);
    expect(result!.rental_property_value_at_end).toEqual(814447.31);
    expect(result!.rental_total_profit).toEqual(699447.31);
    expect(result!.rental_annualized_return).toEqual(16.85);
    
    expect(result!.etf_initial_investment).toEqual(115000);
    expect(result!.etf_final_value).toEqual(242712.85);
    expect(result!.etf_total_profit).toEqual(127712.85);
    expect(result!.etf_annualized_return).toEqual(7.75);
    
    expect(result!.better_investment).toEqual('rental');
    expect(result!.profit_difference).toEqual(571734.46);
    
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent ID', async () => {
    const input: GetComparisonInput = { id: 999999 };

    const result = await getComparisonById(input);

    expect(result).toBeNull();
  });

  it('should verify numeric type conversions', async () => {
    // Create a test comparison
    const insertResult = await db.insert(investmentComparisonsTable)
      .values(testComparisonData)
      .returning()
      .execute();

    const createdComparison = insertResult[0];
    const input: GetComparisonInput = { id: createdComparison.id };

    const result = await getComparisonById(input);

    expect(result).not.toBeNull();
    
    // Verify all numeric fields are returned as numbers, not strings
    expect(typeof result!.property_price).toBe('number');
    expect(typeof result!.down_payment_percentage).toBe('number');
    expect(typeof result!.mortgage_interest_rate).toBe('number');
    expect(typeof result!.monthly_rent).toBe('number');
    expect(typeof result!.annual_rent_increase_rate).toBe('number');
    expect(typeof result!.annual_property_appreciation_rate).toBe('number');
    expect(typeof result!.monthly_maintenance_cost).toBe('number');
    expect(typeof result!.annual_property_tax_rate).toBe('number');
    expect(typeof result!.annual_insurance_cost).toBe('number');
    expect(typeof result!.vacancy_rate_percentage).toBe('number');
    expect(typeof result!.closing_costs).toBe('number');
    expect(typeof result!.selling_costs_percentage).toBe('number');
    expect(typeof result!.etf_annual_return_rate).toBe('number');
    expect(typeof result!.etf_annual_fee_rate).toBe('number');
    
    expect(typeof result!.rental_initial_investment).toBe('number');
    expect(typeof result!.rental_total_cash_flow).toBe('number');
    expect(typeof result!.rental_property_value_at_end).toBe('number');
    expect(typeof result!.rental_total_profit).toBe('number');
    expect(typeof result!.rental_annualized_return).toBe('number');
    
    expect(typeof result!.etf_initial_investment).toBe('number');
    expect(typeof result!.etf_final_value).toBe('number');
    expect(typeof result!.etf_total_profit).toBe('number');
    expect(typeof result!.etf_annualized_return).toBe('number');
    
    expect(typeof result!.profit_difference).toBe('number');
  });
});
