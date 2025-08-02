
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { investmentComparisonsTable } from '../db/schema';
import { getComparisonHistory } from '../handlers/get_comparison_history';

// Test data for investment comparisons
const testComparison1 = {
  comparison_period_years: 10,
  property_price: 500000,
  down_payment_percentage: 20,
  mortgage_interest_rate: 4.5,
  mortgage_term_years: 30,
  monthly_rent: 3000,
  annual_rent_increase_rate: 3,
  annual_property_appreciation_rate: 4,
  monthly_maintenance_cost: 200,
  annual_property_tax_rate: 1.2,
  annual_insurance_cost: 1200,
  vacancy_rate_percentage: 5,
  closing_costs: 15000,
  selling_costs_percentage: 6,
  etf_annual_return_rate: 7,
  etf_annual_fee_rate: 0.05,
  rental_initial_investment: 115000,
  rental_total_cash_flow: 250000,
  rental_property_value_at_end: 740740,
  rental_total_profit: 875740,
  rental_annualized_return: 7.6154,
  etf_initial_investment: 115000,
  etf_final_value: 226156,
  etf_total_profit: 111156,
  etf_annualized_return: 6.9455,
  better_investment: 'rental' as const,
  profit_difference: 764584,
};

const testComparison2 = {
  comparison_period_years: 5,
  property_price: 300000,
  down_payment_percentage: 10,
  mortgage_interest_rate: 5.0,
  mortgage_term_years: 25,
  monthly_rent: 2000,
  annual_rent_increase_rate: 2.5,
  annual_property_appreciation_rate: 3.5,
  monthly_maintenance_cost: 150,
  annual_property_tax_rate: 1.0,
  annual_insurance_cost: 800,
  vacancy_rate_percentage: 3,
  closing_costs: 8000,
  selling_costs_percentage: 5,
  etf_annual_return_rate: 8,
  etf_annual_fee_rate: 0.1,
  rental_initial_investment: 38000,
  rental_total_cash_flow: 80000,
  rental_property_value_at_end: 356769,
  rental_total_profit: 398769,
  rental_annualized_return: 8.2341,
  etf_initial_investment: 38000,
  etf_final_value: 55804,
  etf_total_profit: 17804,
  etf_annualized_return: 7.9100,
  better_investment: 'etf' as const,
  profit_difference: 380965,
};

describe('getComparisonHistory', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no comparisons exist', async () => {
    const result = await getComparisonHistory();
    expect(result).toEqual([]);
  });

  it('should return all comparisons ordered by creation date (newest first)', async () => {
    // Insert test data - first comparison
    await db.insert(investmentComparisonsTable)
      .values({
        ...testComparison1,
        property_price: testComparison1.property_price.toString(),
        down_payment_percentage: testComparison1.down_payment_percentage.toString(),
        mortgage_interest_rate: testComparison1.mortgage_interest_rate.toString(),
        monthly_rent: testComparison1.monthly_rent.toString(),
        annual_rent_increase_rate: testComparison1.annual_rent_increase_rate.toString(),
        annual_property_appreciation_rate: testComparison1.annual_property_appreciation_rate.toString(),
        monthly_maintenance_cost: testComparison1.monthly_maintenance_cost.toString(),
        annual_property_tax_rate: testComparison1.annual_property_tax_rate.toString(),
        annual_insurance_cost: testComparison1.annual_insurance_cost.toString(),
        vacancy_rate_percentage: testComparison1.vacancy_rate_percentage.toString(),
        closing_costs: testComparison1.closing_costs.toString(),
        selling_costs_percentage: testComparison1.selling_costs_percentage.toString(),
        etf_annual_return_rate: testComparison1.etf_annual_return_rate.toString(),
        etf_annual_fee_rate: testComparison1.etf_annual_fee_rate.toString(),
        rental_initial_investment: testComparison1.rental_initial_investment.toString(),
        rental_total_cash_flow: testComparison1.rental_total_cash_flow.toString(),
        rental_property_value_at_end: testComparison1.rental_property_value_at_end.toString(),
        rental_total_profit: testComparison1.rental_total_profit.toString(),
        rental_annualized_return: testComparison1.rental_annualized_return.toString(),
        etf_initial_investment: testComparison1.etf_initial_investment.toString(),
        etf_final_value: testComparison1.etf_final_value.toString(),
        etf_total_profit: testComparison1.etf_total_profit.toString(),
        etf_annualized_return: testComparison1.etf_annualized_return.toString(),
        profit_difference: testComparison1.profit_difference.toString(),
      })
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Insert second comparison (should be newer)
    await db.insert(investmentComparisonsTable)
      .values({
        ...testComparison2,
        property_price: testComparison2.property_price.toString(),
        down_payment_percentage: testComparison2.down_payment_percentage.toString(),
        mortgage_interest_rate: testComparison2.mortgage_interest_rate.toString(),
        monthly_rent: testComparison2.monthly_rent.toString(),
        annual_rent_increase_rate: testComparison2.annual_rent_increase_rate.toString(),
        annual_property_appreciation_rate: testComparison2.annual_property_appreciation_rate.toString(),
        monthly_maintenance_cost: testComparison2.monthly_maintenance_cost.toString(),
        annual_property_tax_rate: testComparison2.annual_property_tax_rate.toString(),
        annual_insurance_cost: testComparison2.annual_insurance_cost.toString(),
        vacancy_rate_percentage: testComparison2.vacancy_rate_percentage.toString(),
        closing_costs: testComparison2.closing_costs.toString(),
        selling_costs_percentage: testComparison2.selling_costs_percentage.toString(),
        etf_annual_return_rate: testComparison2.etf_annual_return_rate.toString(),
        etf_annual_fee_rate: testComparison2.etf_annual_fee_rate.toString(),
        rental_initial_investment: testComparison2.rental_initial_investment.toString(),
        rental_total_cash_flow: testComparison2.rental_total_cash_flow.toString(),
        rental_property_value_at_end: testComparison2.rental_property_value_at_end.toString(),
        rental_total_profit: testComparison2.rental_total_profit.toString(),
        rental_annualized_return: testComparison2.rental_annualized_return.toString(),
        etf_initial_investment: testComparison2.etf_initial_investment.toString(),
        etf_final_value: testComparison2.etf_final_value.toString(),
        etf_total_profit: testComparison2.etf_total_profit.toString(),
        etf_annualized_return: testComparison2.etf_annualized_return.toString(),
        profit_difference: testComparison2.profit_difference.toString(),
      })
      .execute();

    const result = await getComparisonHistory();

    expect(result).toHaveLength(2);

    // Should be ordered by creation date (newest first)
    // Second comparison should be first since it was inserted later
    expect(result[0].comparison_period_years).toEqual(5);
    expect(result[0].property_price).toEqual(300000);
    expect(result[1].comparison_period_years).toEqual(10);
    expect(result[1].property_price).toEqual(500000);

    // Verify all numeric fields are properly converted
    expect(typeof result[0].property_price).toBe('number');
    expect(typeof result[0].rental_annualized_return).toBe('number');
    expect(typeof result[0].etf_final_value).toBe('number');
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should convert all numeric fields correctly', async () => {
    await db.insert(investmentComparisonsTable)
      .values({
        ...testComparison1,
        property_price: testComparison1.property_price.toString(),
        down_payment_percentage: testComparison1.down_payment_percentage.toString(),
        mortgage_interest_rate: testComparison1.mortgage_interest_rate.toString(),
        monthly_rent: testComparison1.monthly_rent.toString(),
        annual_rent_increase_rate: testComparison1.annual_rent_increase_rate.toString(),
        annual_property_appreciation_rate: testComparison1.annual_property_appreciation_rate.toString(),
        monthly_maintenance_cost: testComparison1.monthly_maintenance_cost.toString(),
        annual_property_tax_rate: testComparison1.annual_property_tax_rate.toString(),
        annual_insurance_cost: testComparison1.annual_insurance_cost.toString(),
        vacancy_rate_percentage: testComparison1.vacancy_rate_percentage.toString(),
        closing_costs: testComparison1.closing_costs.toString(),
        selling_costs_percentage: testComparison1.selling_costs_percentage.toString(),
        etf_annual_return_rate: testComparison1.etf_annual_return_rate.toString(),
        etf_annual_fee_rate: testComparison1.etf_annual_fee_rate.toString(),
        rental_initial_investment: testComparison1.rental_initial_investment.toString(),
        rental_total_cash_flow: testComparison1.rental_total_cash_flow.toString(),
        rental_property_value_at_end: testComparison1.rental_property_value_at_end.toString(),
        rental_total_profit: testComparison1.rental_total_profit.toString(),
        rental_annualized_return: testComparison1.rental_annualized_return.toString(),
        etf_initial_investment: testComparison1.etf_initial_investment.toString(),
        etf_final_value: testComparison1.etf_final_value.toString(),
        etf_total_profit: testComparison1.etf_total_profit.toString(),
        etf_annualized_return: testComparison1.etf_annualized_return.toString(),
        profit_difference: testComparison1.profit_difference.toString(),
      })
      .execute();

    const result = await getComparisonHistory();

    expect(result).toHaveLength(1);
    const comparison = result[0];

    // Verify specific numeric values
    expect(comparison.property_price).toEqual(500000);
    expect(comparison.down_payment_percentage).toEqual(20);
    expect(comparison.mortgage_interest_rate).toEqual(4.5);
    expect(comparison.rental_annualized_return).toEqual(7.6154);
    expect(comparison.etf_annual_fee_rate).toEqual(0.05);
    expect(comparison.profit_difference).toEqual(764584);

    // Verify field is a proper ID
    expect(comparison.id).toBeDefined();
    expect(typeof comparison.id).toBe('number');
    
    // Verify text fields remain unchanged
    expect(comparison.better_investment).toEqual('rental');
    expect(comparison.created_at).toBeInstanceOf(Date);
  });

  it('should handle both rental and etf as better_investment values', async () => {
    // Insert comparison where rental is better
    await db.insert(investmentComparisonsTable)
      .values({
        ...testComparison1,
        property_price: testComparison1.property_price.toString(),
        down_payment_percentage: testComparison1.down_payment_percentage.toString(),
        mortgage_interest_rate: testComparison1.mortgage_interest_rate.toString(),
        monthly_rent: testComparison1.monthly_rent.toString(),
        annual_rent_increase_rate: testComparison1.annual_rent_increase_rate.toString(),
        annual_property_appreciation_rate: testComparison1.annual_property_appreciation_rate.toString(),
        monthly_maintenance_cost: testComparison1.monthly_maintenance_cost.toString(),
        annual_property_tax_rate: testComparison1.annual_property_tax_rate.toString(),
        annual_insurance_cost: testComparison1.annual_insurance_cost.toString(),
        vacancy_rate_percentage: testComparison1.vacancy_rate_percentage.toString(),
        closing_costs: testComparison1.closing_costs.toString(),
        selling_costs_percentage: testComparison1.selling_costs_percentage.toString(),
        etf_annual_return_rate: testComparison1.etf_annual_return_rate.toString(),
        etf_annual_fee_rate: testComparison1.etf_annual_fee_rate.toString(),
        rental_initial_investment: testComparison1.rental_initial_investment.toString(),
        rental_total_cash_flow: testComparison1.rental_total_cash_flow.toString(),
        rental_property_value_at_end: testComparison1.rental_property_value_at_end.toString(),
        rental_total_profit: testComparison1.rental_total_profit.toString(),
        rental_annualized_return: testComparison1.rental_annualized_return.toString(),
        etf_initial_investment: testComparison1.etf_initial_investment.toString(),
        etf_final_value: testComparison1.etf_final_value.toString(),
        etf_total_profit: testComparison1.etf_total_profit.toString(),
        etf_annualized_return: testComparison1.etf_annualized_return.toString(),
        profit_difference: testComparison1.profit_difference.toString(),
      })
      .execute();

    // Insert comparison where ETF is better
    await db.insert(investmentComparisonsTable)
      .values({
        ...testComparison2,
        property_price: testComparison2.property_price.toString(),
        down_payment_percentage: testComparison2.down_payment_percentage.toString(),
        mortgage_interest_rate: testComparison2.mortgage_interest_rate.toString(),
        monthly_rent: testComparison2.monthly_rent.toString(),
        annual_rent_increase_rate: testComparison2.annual_rent_increase_rate.toString(),
        annual_property_appreciation_rate: testComparison2.annual_property_appreciation_rate.toString(),
        monthly_maintenance_cost: testComparison2.monthly_maintenance_cost.toString(),
        annual_property_tax_rate: testComparison2.annual_property_tax_rate.toString(),
        annual_insurance_cost: testComparison2.annual_insurance_cost.toString(),
        vacancy_rate_percentage: testComparison2.vacancy_rate_percentage.toString(),
        closing_costs: testComparison2.closing_costs.toString(),
        selling_costs_percentage: testComparison2.selling_costs_percentage.toString(),
        etf_annual_return_rate: testComparison2.etf_annual_return_rate.toString(),
        etf_annual_fee_rate: testComparison2.etf_annual_fee_rate.toString(),
        rental_initial_investment: testComparison2.rental_initial_investment.toString(),
        rental_total_cash_flow: testComparison2.rental_total_cash_flow.toString(),
        rental_property_value_at_end: testComparison2.rental_property_value_at_end.toString(),
        rental_total_profit: testComparison2.rental_total_profit.toString(),
        rental_annualized_return: testComparison2.rental_annualized_return.toString(),
        etf_initial_investment: testComparison2.etf_initial_investment.toString(),
        etf_final_value: testComparison2.etf_final_value.toString(),
        etf_total_profit: testComparison2.etf_total_profit.toString(),
        etf_annualized_return: testComparison2.etf_annualized_return.toString(),
        profit_difference: testComparison2.profit_difference.toString(),
      })
      .execute();

    const result = await getComparisonHistory();

    expect(result).toHaveLength(2);
    
    // Find the rental and etf comparisons
    const rentalComparison = result.find(r => r.better_investment === 'rental');
    const etfComparison = result.find(r => r.better_investment === 'etf');

    expect(rentalComparison).toBeDefined();
    expect(etfComparison).toBeDefined();
    expect(rentalComparison!.better_investment).toEqual('rental');
    expect(etfComparison!.better_investment).toEqual('etf');
  });
});
