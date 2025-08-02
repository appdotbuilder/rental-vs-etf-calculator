
import { z } from 'zod';

// Investment comparison input schema
export const investmentComparisonInputSchema = z.object({
  // Common parameters
  comparison_period_years: z.number().int().positive(),
  
  // Rental apartment parameters
  property_price: z.number().positive(),
  down_payment_percentage: z.number().min(0).max(100),
  mortgage_interest_rate: z.number().min(0).max(100), // Annual percentage
  mortgage_term_years: z.number().int().positive(),
  monthly_rent: z.number().positive(),
  annual_rent_increase_rate: z.number().min(0).max(100), // Annual percentage
  annual_property_appreciation_rate: z.number().min(-100).max(100), // Can be negative
  monthly_maintenance_cost: z.number().nonnegative(),
  annual_property_tax_rate: z.number().min(0).max(100), // Percentage of property value
  annual_insurance_cost: z.number().nonnegative(),
  vacancy_rate_percentage: z.number().min(0).max(100), // Percentage of time vacant
  closing_costs: z.number().nonnegative(),
  selling_costs_percentage: z.number().min(0).max(100), // Percentage of sale price
  
  // ETF parameters
  etf_annual_return_rate: z.number().min(-100).max(100), // Annual percentage, can be negative
  etf_annual_fee_rate: z.number().min(0).max(100), // Annual percentage
});

export type InvestmentComparisonInput = z.infer<typeof investmentComparisonInputSchema>;

// Investment comparison result schema
export const investmentComparisonResultSchema = z.object({
  id: z.number(),
  
  // Input parameters (stored for reference)
  comparison_period_years: z.number(),
  property_price: z.number(),
  down_payment_percentage: z.number(),
  mortgage_interest_rate: z.number(),
  mortgage_term_years: z.number(),
  monthly_rent: z.number(),
  annual_rent_increase_rate: z.number(),
  annual_property_appreciation_rate: z.number(),
  monthly_maintenance_cost: z.number(),
  annual_property_tax_rate: z.number(),
  annual_insurance_cost: z.number(),
  vacancy_rate_percentage: z.number(),
  closing_costs: z.number(),
  selling_costs_percentage: z.number(),
  etf_annual_return_rate: z.number(),
  etf_annual_fee_rate: z.number(),
  
  // Calculated results
  rental_initial_investment: z.number(),
  rental_total_cash_flow: z.number(),
  rental_property_value_at_end: z.number(),
  rental_total_profit: z.number(),
  rental_annualized_return: z.number(),
  
  etf_initial_investment: z.number(),
  etf_final_value: z.number(),
  etf_total_profit: z.number(),
  etf_annualized_return: z.number(),
  
  better_investment: z.enum(['rental', 'etf']),
  profit_difference: z.number(),
  
  created_at: z.coerce.date()
});

export type InvestmentComparisonResult = z.infer<typeof investmentComparisonResultSchema>;

// Schema for retrieving saved comparisons
export const getComparisonInputSchema = z.object({
  id: z.number()
});

export type GetComparisonInput = z.infer<typeof getComparisonInputSchema>;
