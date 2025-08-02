
import { db } from '../db';
import { investmentComparisonsTable } from '../db/schema';
import { type InvestmentComparisonInput, type InvestmentComparisonResult } from '../schema';

export async function calculateInvestmentComparison(input: InvestmentComparisonInput): Promise<InvestmentComparisonResult> {
  try {
    // Calculate rental property investment
    const rentalResults = calculateRentalInvestment(input);
    
    // Calculate ETF investment (using same initial investment as rental)
    const etfResults = calculateEtfInvestment(input, rentalResults.initialInvestment);
    
    // Determine which investment is better
    const betterInvestment = rentalResults.totalProfit > etfResults.totalProfit ? 'rental' : 'etf';
    const profitDifference = Math.abs(rentalResults.totalProfit - etfResults.totalProfit);
    
    // Save to database
    const result = await db.insert(investmentComparisonsTable)
      .values({
        // Input parameters (convert numbers to strings for numeric columns)
        comparison_period_years: input.comparison_period_years,
        property_price: input.property_price.toString(),
        down_payment_percentage: input.down_payment_percentage.toString(),
        mortgage_interest_rate: input.mortgage_interest_rate.toString(),
        mortgage_term_years: input.mortgage_term_years,
        monthly_rent: input.monthly_rent.toString(),
        annual_rent_increase_rate: input.annual_rent_increase_rate.toString(),
        annual_property_appreciation_rate: input.annual_property_appreciation_rate.toString(),
        monthly_maintenance_cost: input.monthly_maintenance_cost.toString(),
        annual_property_tax_rate: input.annual_property_tax_rate.toString(),
        annual_insurance_cost: input.annual_insurance_cost.toString(),
        vacancy_rate_percentage: input.vacancy_rate_percentage.toString(),
        closing_costs: input.closing_costs.toString(),
        selling_costs_percentage: input.selling_costs_percentage.toString(),
        etf_annual_return_rate: input.etf_annual_return_rate.toString(),
        etf_annual_fee_rate: input.etf_annual_fee_rate.toString(),
        
        // Calculated results (convert numbers to strings for numeric columns)
        rental_initial_investment: rentalResults.initialInvestment.toString(),
        rental_total_cash_flow: rentalResults.totalCashFlow.toString(),
        rental_property_value_at_end: rentalResults.propertyValueAtEnd.toString(),
        rental_total_profit: rentalResults.totalProfit.toString(),
        rental_annualized_return: rentalResults.annualizedReturn.toString(),
        
        etf_initial_investment: etfResults.initialInvestment.toString(),
        etf_final_value: etfResults.finalValue.toString(),
        etf_total_profit: etfResults.totalProfit.toString(),
        etf_annualized_return: etfResults.annualizedReturn.toString(),
        
        better_investment: betterInvestment,
        profit_difference: profitDifference.toString(),
      })
      .returning()
      .execute();

    // Convert numeric fields back to numbers for return
    const savedResult = result[0];
    return {
      id: savedResult.id,
      
      // Input parameters
      comparison_period_years: savedResult.comparison_period_years,
      property_price: parseFloat(savedResult.property_price),
      down_payment_percentage: parseFloat(savedResult.down_payment_percentage),
      mortgage_interest_rate: parseFloat(savedResult.mortgage_interest_rate),
      mortgage_term_years: savedResult.mortgage_term_years,
      monthly_rent: parseFloat(savedResult.monthly_rent),
      annual_rent_increase_rate: parseFloat(savedResult.annual_rent_increase_rate),
      annual_property_appreciation_rate: parseFloat(savedResult.annual_property_appreciation_rate),
      monthly_maintenance_cost: parseFloat(savedResult.monthly_maintenance_cost),
      annual_property_tax_rate: parseFloat(savedResult.annual_property_tax_rate),
      annual_insurance_cost: parseFloat(savedResult.annual_insurance_cost),
      vacancy_rate_percentage: parseFloat(savedResult.vacancy_rate_percentage),
      closing_costs: parseFloat(savedResult.closing_costs),
      selling_costs_percentage: parseFloat(savedResult.selling_costs_percentage),
      etf_annual_return_rate: parseFloat(savedResult.etf_annual_return_rate),
      etf_annual_fee_rate: parseFloat(savedResult.etf_annual_fee_rate),
      
      // Calculated results
      rental_initial_investment: parseFloat(savedResult.rental_initial_investment),
      rental_total_cash_flow: parseFloat(savedResult.rental_total_cash_flow),
      rental_property_value_at_end: parseFloat(savedResult.rental_property_value_at_end),
      rental_total_profit: parseFloat(savedResult.rental_total_profit),
      rental_annualized_return: parseFloat(savedResult.rental_annualized_return),
      
      etf_initial_investment: parseFloat(savedResult.etf_initial_investment),
      etf_final_value: parseFloat(savedResult.etf_final_value),
      etf_total_profit: parseFloat(savedResult.etf_total_profit),
      etf_annualized_return: parseFloat(savedResult.etf_annualized_return),
      
      better_investment: savedResult.better_investment as 'rental' | 'etf',
      profit_difference: parseFloat(savedResult.profit_difference),
      
      created_at: savedResult.created_at
    };
  } catch (error) {
    console.error('Investment comparison calculation failed:', error);
    throw error;
  }
}

function calculateRentalInvestment(input: InvestmentComparisonInput) {
  // Initial investment calculation
  const downPayment = (input.property_price * input.down_payment_percentage) / 100;
  const initialInvestment = downPayment + input.closing_costs;
  
  // Mortgage calculation
  const loanAmount = input.property_price - downPayment;
  const monthlyInterestRate = input.mortgage_interest_rate / 100 / 12;
  const totalPayments = input.mortgage_term_years * 12;
  
  // Monthly mortgage payment using standard formula
  const monthlyMortgagePayment = monthlyInterestRate > 0
    ? loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
    : loanAmount / totalPayments; // If no interest
  
  // Calculate cash flow for each year
  let totalCashFlow = 0;
  let currentMonthlyRent = input.monthly_rent;
  let currentPropertyValue = input.property_price;
  
  for (let year = 1; year <= input.comparison_period_years; year++) {
    // Annual rental income (adjusted for vacancy)
    const annualRent = currentMonthlyRent * 12 * (1 - input.vacancy_rate_percentage / 100);
    
    // Annual expenses
    const annualMortgagePayments = Math.min(monthlyMortgagePayment * 12, year * 12 <= input.mortgage_term_years * 12 ? monthlyMortgagePayment * 12 : 0);
    const annualMaintenance = input.monthly_maintenance_cost * 12;
    const annualPropertyTax = currentPropertyValue * input.annual_property_tax_rate / 100;
    const annualInsurance = input.annual_insurance_cost;
    
    const annualExpenses = annualMortgagePayments + annualMaintenance + annualPropertyTax + annualInsurance;
    
    // Net cash flow for this year
    const yearCashFlow = annualRent - annualExpenses;
    totalCashFlow += yearCashFlow;
    
    // Update for next year
    currentMonthlyRent *= (1 + input.annual_rent_increase_rate / 100);
    currentPropertyValue *= (1 + input.annual_property_appreciation_rate / 100);
  }
  
  const propertyValueAtEnd = currentPropertyValue;
  
  // Calculate selling proceeds (after selling costs)
  const sellingCosts = propertyValueAtEnd * input.selling_costs_percentage / 100;
  const netProceedsFromSale = propertyValueAtEnd - sellingCosts;
  
  // Calculate remaining mortgage balance
  const remainingPayments = Math.max(0, (input.mortgage_term_years * 12) - (input.comparison_period_years * 12));
  let remainingBalance = 0;
  
  if (remainingPayments > 0 && monthlyInterestRate > 0) {
    remainingBalance = loanAmount * (Math.pow(1 + monthlyInterestRate, totalPayments) - Math.pow(1 + monthlyInterestRate, input.comparison_period_years * 12)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  }
  
  const netSaleProceeds = netProceedsFromSale - remainingBalance;
  
  // Total profit = cash flow + net sale proceeds - initial investment
  const totalProfit = totalCashFlow + netSaleProceeds - initialInvestment;
  
  // Annualized return calculation
  const annualizedReturn = input.comparison_period_years > 0 
    ? (Math.pow(1 + totalProfit / initialInvestment, 1 / input.comparison_period_years) - 1) * 100
    : 0;
  
  return {
    initialInvestment,
    totalCashFlow,
    propertyValueAtEnd,
    totalProfit,
    annualizedReturn
  };
}

function calculateEtfInvestment(input: InvestmentComparisonInput, initialInvestment: number) {
  // ETF calculation with compound growth and annual fees
  const annualReturnRate = input.etf_annual_return_rate / 100;
  const annualFeeRate = input.etf_annual_fee_rate / 100;
  const netAnnualReturn = annualReturnRate - annualFeeRate;
  
  // Compound growth over the investment period
  const finalValue = initialInvestment * Math.pow(1 + netAnnualReturn, input.comparison_period_years);
  const totalProfit = finalValue - initialInvestment;
  
  // Annualized return calculation
  const annualizedReturn = input.comparison_period_years > 0 
    ? (Math.pow(finalValue / initialInvestment, 1 / input.comparison_period_years) - 1) * 100
    : 0;
  
  return {
    initialInvestment,
    finalValue,
    totalProfit,
    annualizedReturn
  };
}
