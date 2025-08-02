
import { serial, numeric, integer, pgTable, timestamp, text } from 'drizzle-orm/pg-core';

export const investmentComparisonsTable = pgTable('investment_comparisons', {
  id: serial('id').primaryKey(),
  
  // Input parameters
  comparison_period_years: integer('comparison_period_years').notNull(),
  property_price: numeric('property_price', { precision: 12, scale: 2 }).notNull(),
  down_payment_percentage: numeric('down_payment_percentage', { precision: 5, scale: 2 }).notNull(),
  mortgage_interest_rate: numeric('mortgage_interest_rate', { precision: 5, scale: 2 }).notNull(),
  mortgage_term_years: integer('mortgage_term_years').notNull(),
  monthly_rent: numeric('monthly_rent', { precision: 8, scale: 2 }).notNull(),
  annual_rent_increase_rate: numeric('annual_rent_increase_rate', { precision: 5, scale: 2 }).notNull(),
  annual_property_appreciation_rate: numeric('annual_property_appreciation_rate', { precision: 5, scale: 2 }).notNull(),
  monthly_maintenance_cost: numeric('monthly_maintenance_cost', { precision: 8, scale: 2 }).notNull(),
  annual_property_tax_rate: numeric('annual_property_tax_rate', { precision: 5, scale: 2 }).notNull(),
  annual_insurance_cost: numeric('annual_insurance_cost', { precision: 8, scale: 2 }).notNull(),
  vacancy_rate_percentage: numeric('vacancy_rate_percentage', { precision: 5, scale: 2 }).notNull(),
  closing_costs: numeric('closing_costs', { precision: 10, scale: 2 }).notNull(),
  selling_costs_percentage: numeric('selling_costs_percentage', { precision: 5, scale: 2 }).notNull(),
  etf_annual_return_rate: numeric('etf_annual_return_rate', { precision: 5, scale: 2 }).notNull(),
  etf_annual_fee_rate: numeric('etf_annual_fee_rate', { precision: 5, scale: 2 }).notNull(),
  
  // Calculated results
  rental_initial_investment: numeric('rental_initial_investment', { precision: 12, scale: 2 }).notNull(),
  rental_total_cash_flow: numeric('rental_total_cash_flow', { precision: 12, scale: 2 }).notNull(),
  rental_property_value_at_end: numeric('rental_property_value_at_end', { precision: 12, scale: 2 }).notNull(),
  rental_total_profit: numeric('rental_total_profit', { precision: 12, scale: 2 }).notNull(),
  rental_annualized_return: numeric('rental_annualized_return', { precision: 7, scale: 4 }).notNull(),
  
  etf_initial_investment: numeric('etf_initial_investment', { precision: 12, scale: 2 }).notNull(),
  etf_final_value: numeric('etf_final_value', { precision: 12, scale: 2 }).notNull(),
  etf_total_profit: numeric('etf_total_profit', { precision: 12, scale: 2 }).notNull(),
  etf_annualized_return: numeric('etf_annualized_return', { precision: 7, scale: 4 }).notNull(),
  
  better_investment: text('better_investment').notNull(), // 'rental' or 'etf'
  profit_difference: numeric('profit_difference', { precision: 12, scale: 2 }).notNull(),
  
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type InvestmentComparison = typeof investmentComparisonsTable.$inferSelect;
export type NewInvestmentComparison = typeof investmentComparisonsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { investmentComparisons: investmentComparisonsTable };
