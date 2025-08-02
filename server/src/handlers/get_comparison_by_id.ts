
import { db } from '../db';
import { investmentComparisonsTable } from '../db/schema';
import { type GetComparisonInput, type InvestmentComparisonResult } from '../schema';
import { eq } from 'drizzle-orm';

export async function getComparisonById(input: GetComparisonInput): Promise<InvestmentComparisonResult | null> {
  try {
    const results = await db.select()
      .from(investmentComparisonsTable)
      .where(eq(investmentComparisonsTable.id, input.id))
      .execute();

    if (results.length === 0) {
      return null;
    }

    const comparison = results[0];
    
    // Convert all numeric fields back to numbers
    return {
      id: comparison.id,
      
      // Input parameters
      comparison_period_years: comparison.comparison_period_years,
      property_price: parseFloat(comparison.property_price),
      down_payment_percentage: parseFloat(comparison.down_payment_percentage),
      mortgage_interest_rate: parseFloat(comparison.mortgage_interest_rate),
      mortgage_term_years: comparison.mortgage_term_years,
      monthly_rent: parseFloat(comparison.monthly_rent),
      annual_rent_increase_rate: parseFloat(comparison.annual_rent_increase_rate),
      annual_property_appreciation_rate: parseFloat(comparison.annual_property_appreciation_rate),
      monthly_maintenance_cost: parseFloat(comparison.monthly_maintenance_cost),
      annual_property_tax_rate: parseFloat(comparison.annual_property_tax_rate),
      annual_insurance_cost: parseFloat(comparison.annual_insurance_cost),
      vacancy_rate_percentage: parseFloat(comparison.vacancy_rate_percentage),
      closing_costs: parseFloat(comparison.closing_costs),
      selling_costs_percentage: parseFloat(comparison.selling_costs_percentage),
      etf_annual_return_rate: parseFloat(comparison.etf_annual_return_rate),
      etf_annual_fee_rate: parseFloat(comparison.etf_annual_fee_rate),
      
      // Calculated results
      rental_initial_investment: parseFloat(comparison.rental_initial_investment),
      rental_total_cash_flow: parseFloat(comparison.rental_total_cash_flow),
      rental_property_value_at_end: parseFloat(comparison.rental_property_value_at_end),
      rental_total_profit: parseFloat(comparison.rental_total_profit),
      rental_annualized_return: parseFloat(comparison.rental_annualized_return),
      
      etf_initial_investment: parseFloat(comparison.etf_initial_investment),
      etf_final_value: parseFloat(comparison.etf_final_value),
      etf_total_profit: parseFloat(comparison.etf_total_profit),
      etf_annualized_return: parseFloat(comparison.etf_annualized_return),
      
      better_investment: comparison.better_investment as 'rental' | 'etf',
      profit_difference: parseFloat(comparison.profit_difference),
      
      created_at: comparison.created_at
    };
  } catch (error) {
    console.error('Get comparison by ID failed:', error);
    throw error;
  }
}
