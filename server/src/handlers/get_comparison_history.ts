
import { db } from '../db';
import { investmentComparisonsTable } from '../db/schema';
import { type InvestmentComparisonResult } from '../schema';
import { desc } from 'drizzle-orm';

export async function getComparisonHistory(): Promise<InvestmentComparisonResult[]> {
  try {
    const results = await db.select()
      .from(investmentComparisonsTable)
      .orderBy(desc(investmentComparisonsTable.created_at))
      .execute();

    // Convert all numeric fields back to numbers and type the better_investment field
    return results.map(result => ({
      ...result,
      property_price: parseFloat(result.property_price),
      down_payment_percentage: parseFloat(result.down_payment_percentage),
      mortgage_interest_rate: parseFloat(result.mortgage_interest_rate),
      monthly_rent: parseFloat(result.monthly_rent),
      annual_rent_increase_rate: parseFloat(result.annual_rent_increase_rate),
      annual_property_appreciation_rate: parseFloat(result.annual_property_appreciation_rate),
      monthly_maintenance_cost: parseFloat(result.monthly_maintenance_cost),
      annual_property_tax_rate: parseFloat(result.annual_property_tax_rate),
      annual_insurance_cost: parseFloat(result.annual_insurance_cost),
      vacancy_rate_percentage: parseFloat(result.vacancy_rate_percentage),
      closing_costs: parseFloat(result.closing_costs),
      selling_costs_percentage: parseFloat(result.selling_costs_percentage),
      etf_annual_return_rate: parseFloat(result.etf_annual_return_rate),
      etf_annual_fee_rate: parseFloat(result.etf_annual_fee_rate),
      rental_initial_investment: parseFloat(result.rental_initial_investment),
      rental_total_cash_flow: parseFloat(result.rental_total_cash_flow),
      rental_property_value_at_end: parseFloat(result.rental_property_value_at_end),
      rental_total_profit: parseFloat(result.rental_total_profit),
      rental_annualized_return: parseFloat(result.rental_annualized_return),
      etf_initial_investment: parseFloat(result.etf_initial_investment),
      etf_final_value: parseFloat(result.etf_final_value),
      etf_total_profit: parseFloat(result.etf_total_profit),
      etf_annualized_return: parseFloat(result.etf_annualized_return),
      profit_difference: parseFloat(result.profit_difference),
      better_investment: result.better_investment as 'rental' | 'etf',
    }));
  } catch (error) {
    console.error('Failed to fetch comparison history:', error);
    throw error;
  }
}
