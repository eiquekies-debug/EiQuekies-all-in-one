import { jsonResponse, errorResponse } from '../utils/response.js';

export async function handleCalculatorRoutes(path, method, request, env, user) {
  if (path === '/api/calculator/cost' && method === 'POST') {
    const body = await request.json();
    const { ingredients_cost, packaging_cost, electricity_cost, labour_cost, profit_margin_percent } = body;

    const totalCost = Number(ingredients_cost || 0) + Number(packaging_cost || 0) + Number(electricity_cost || 0) + Number(labour_cost || 0);
    const marginRatio = Number(profit_margin_percent || 30) / 100;
    
    // Auto Kira Harga Cadangan
    const profitAmount = totalCost * marginRatio;
    const recommendedRetailPrice = totalCost + profitAmount;

    // Harga Tier Automatik
    const pricingTiers = {
      retail: recommendedRetailPrice,
      walk_in: recommendedRetailPrice,
      agent: recommendedRetailPrice * 0.85,    // 15% Diskaun Agent
      dropship: recommendedRetailPrice * 0.90, // 10% Diskaun Dropship
      wholesale: recommendedRetailPrice * 0.75  // 25% Diskaun Borong
    };

    return jsonResponse({
      success: true,
      data: {
        totalCost,
        profitAmount,
        profitMarginPercent: profit_margin_percent,
        pricingTiers
      }
    });
  }

  return errorResponse('Laluan tidak dijumpai', 404);
}
