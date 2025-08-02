
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, TrendingUp, Home, BarChart3, Calculator } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
// Using type-only imports for better TypeScript compliance
import type { InvestmentComparisonInput, InvestmentComparisonResult } from '../../server/src/schema';

function App() {
  const [results, setResults] = useState<InvestmentComparisonResult | null>(null);
  const [history, setHistory] = useState<InvestmentComparisonResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Form state with proper typing
  const [formData, setFormData] = useState<InvestmentComparisonInput>({
    comparison_period_years: 10,
    property_price: 500000,
    down_payment_percentage: 20,
    mortgage_interest_rate: 6.5,
    mortgage_term_years: 30,
    monthly_rent: 2500,
    annual_rent_increase_rate: 3,
    annual_property_appreciation_rate: 4,
    monthly_maintenance_cost: 200,
    annual_property_tax_rate: 1.2,
    annual_insurance_cost: 1200,
    vacancy_rate_percentage: 5,
    closing_costs: 10000,
    selling_costs_percentage: 6,
    etf_annual_return_rate: 8,
    etf_annual_fee_rate: 0.5
  });

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const historyData = await trpc.getComparisonHistory.query();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load comparison history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    try {
      const result = await trpc.calculateInvestmentComparison.mutate(formData);
      setResults(result);
      // Refresh history to include new calculation
      await loadHistory();
    } catch (error) {
      console.error('Failed to calculate investment comparison:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: keyof InvestmentComparisonInput, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev: InvestmentComparisonInput) => ({
      ...prev,
      [field]: numValue
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number): string => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Investment Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare the long-term profitability of rental property investment versus ETF investment 📈
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Investment Parameters
                  </CardTitle>
                  <CardDescription>
                    Enter your investment details to compare rental property vs ETF returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCalculate} className="space-y-6">
                    {/* General Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        ⏱️ General Parameters
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="comparison_period_years">Investment Period (Years)</Label>
                          <Input
                            id="comparison_period_years"
                            type="number"
                            value={formData.comparison_period_years}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('comparison_period_years', e.target.value)
                            }
                            min="1"
                            max="50"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Rental Property Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        🏠 Rental Property
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="property_price">Property Price</Label>
                          <Input
                            id="property_price"
                            type="number"
                            value={formData.property_price}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('property_price', e.target.value)
                            }
                            min="0"
                            step="1000"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="down_payment_percentage">Down Payment (%)</Label>
                          <Input
                            id="down_payment_percentage"
                            type="number"
                            value={formData.down_payment_percentage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('down_payment_percentage', e.target.value)
                            }
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mortgage_interest_rate">Mortgage Interest Rate (%)</Label>
                          <Input
                            id="mortgage_interest_rate"
                            type="number"
                            value={formData.mortgage_interest_rate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('mortgage_interest_rate', e.target.value)
                            }
                            min="0"
                            max="50"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mortgage_term_years">Mortgage Term (Years)</Label>
                          <Input
                            id="mortgage_term_years"
                            type="number"
                            value={formData.mortgage_term_years}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('mortgage_term_years', e.target.value)
                            }
                            min="1"
                            max="50"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="monthly_rent">Monthly Rent</Label>
                          <Input
                            id="monthly_rent"
                            type="number"
                            value={formData.monthly_rent}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('monthly_rent', e.target.value)
                            }
                            min="0"
                            step="10"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="annual_rent_increase_rate">Annual Rent Increase (%)</Label>
                          <Input
                            id="annual_rent_increase_rate"
                            type="number"
                            value={formData.annual_rent_increase_rate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('annual_rent_increase_rate', e.target.value)
                            }
                            min="0"
                            max="50"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="annual_property_appreciation_rate">Property Appreciation (%)</Label>
                          <Input
                            id="annual_property_appreciation_rate"
                            type="number"
                            value={formData.annual_property_appreciation_rate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('annual_property_appreciation_rate', e.target.value)
                            }
                            min="-100"
                            max="100"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="monthly_maintenance_cost">Monthly Maintenance</Label>
                          <Input
                            id="monthly_maintenance_cost"
                            type="number"
                            value={formData.monthly_maintenance_cost}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('monthly_maintenance_cost', e.target.value)
                            }
                            min="0"
                            step="10"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="annual_property_tax_rate">Property Tax Rate (%)</Label>
                          <Input
                            id="annual_property_tax_rate"
                            type="number"
                            value={formData.annual_property_tax_rate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('annual_property_tax_rate', e.target.value)
                            }
                            min="0"
                            max="10"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="annual_insurance_cost">Annual Insurance</Label>
                          <Input
                            id="annual_insurance_cost"
                            type="number"
                            value={formData.annual_insurance_cost}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('annual_insurance_cost', e.target.value)
                            }
                            min="0"
                            step="100"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="vacancy_rate_percentage">Vacancy Rate (%)</Label>
                          <Input
                            id="vacancy_rate_percentage"
                            type="number"
                            value={formData.vacancy_rate_percentage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('vacancy_rate_percentage', e.target.value)
                            }
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="closing_costs">Closing Costs</Label>
                          <Input
                            id="closing_costs"
                            type="number"
                            value={formData.closing_costs}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('closing_costs', e.target.value)
                            }
                            min="0"
                            step="100"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="selling_costs_percentage">Selling Costs (%)</Label>
                          <Input
                            id="selling_costs_percentage"
                            type="number"
                            value={formData.selling_costs_percentage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('selling_costs_percentage', e.target.value)
                            }
                            min="0"
                            max="50"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* ETF Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        📊 ETF Investment
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="etf_annual_return_rate">Expected Annual Return (%)</Label>
                          <Input
                            id="etf_annual_return_rate"
                            type="number"
                            value={formData.etf_annual_return_rate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('etf_annual_return_rate', e.target.value)
                            }
                            min="-100"
                            max="100"
                            step="0.1"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="etf_annual_fee_rate">Annual Management Fee (%)</Label>
                          <Input
                            id="etf_annual_fee_rate"
                            type="number"
                            value={formData.etf_annual_fee_rate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleInputChange('etf_annual_fee_rate', e.target.value)
                            }
                            min="0"
                            max="10"
                            step="0.01"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isCalculating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    >
                      {isCalculating ? 'Calculating...' : '🧮 Calculate Investment Comparison'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              {results && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Investment Comparison Results
                    </CardTitle>
                    <CardDescription>
                      {formData.comparison_period_years}-year investment comparison analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Winner Badge */}
                    <Alert className={`border-2 ${results.better_investment === 'rental' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-semibold">
                        🏆 <strong>{results.better_investment === 'rental' ? 'Rental Property' : 'ETF Investment'}</strong> is the better investment by {formatCurrency(results.profit_difference)}
                      </AlertDescription>
                    </Alert>

                    {/* Rental Property Results */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Home className="h-5 w-5 text-green-600" />
                        🏠 Rental Property Results
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Initial Investment</p>
                          <p className="font-semibold text-lg">{formatCurrency(results.rental_initial_investment)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Total Cash Flow</p>
                          <p className="font-semibold text-lg">{formatCurrency(results.rental_total_cash_flow)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Property Value at End</p>
                          <p className="font-semibold text-lg">{formatCurrency(results.rental_property_value_at_end)}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <p className="text-sm text-green-700">Total Profit</p>
                          <p className="font-bold text-lg text-green-700">{formatCurrency(results.rental_total_profit)}</p>
                        </div>
                      </div>
                      <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
                        <p className="text-sm text-green-700">Annualized Return</p>
                        <p className="font-bold text-2xl text-green-700">{formatPercentage(results.rental_annualized_return)}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* ETF Results */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        📊 ETF Investment Results
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Initial Investment</p>
                          <p className="font-semibold text-lg">{formatCurrency(results.etf_initial_investment)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Final Value</p>
                          <p className="font-semibold text-lg">{formatCurrency(results.etf_final_value)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg col-span-2">
                          <p className="text-sm text-blue-700">Total Profit</p>
                          <p className="font-bold text-lg text-blue-700">{formatCurrency(results.etf_total_profit)}</p>
                        </div>
                      </div>
                      <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">Annualized Return</p>
                        <p className="font-bold text-2xl text-blue-700">{formatPercentage(results.etf_annualized_return)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>
                  Review your previous investment comparisons
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading history...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No calculations yet. Try the calculator first! 📊</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((comparison: InvestmentComparisonResult) => (
                      <Card key={comparison.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={comparison.better_investment === 'rental' ? 'default' : 'secondary'}>
                                  {comparison.better_investment === 'rental' ? '🏠 Rental Won' : '📊 ETF Won'}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {comparison.comparison_period_years} years
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Property: {formatCurrency(comparison.property_price)} • 
                                ETF Return: {formatPercentage(comparison.etf_annual_return_rate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                Advantage: {formatCurrency(comparison.profit_difference)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {comparison.created_at.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
