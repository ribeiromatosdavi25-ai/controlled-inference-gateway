const fs = require('fs').promises;
const path = require('path');

const BUDGET_FILE = path.join(__dirname, 'budget.json');
const DAILY_BUDGET_USD = 2.00;

// Tasas aproximadas (actualiza según modelo)
const RATES = {
  inputTokensPer1k: 0.003,   // $3/1M tokens input
  outputTokensPer1k: 0.015   // $15/1M tokens output
};

class BudgetTracker {
  constructor() {
    this.state = null;
  }

  async init() {
    try {
      const data = await fs.readFile(BUDGET_FILE, 'utf8');
      this.state = JSON.parse(data);
    } catch {
      this.state = {
        spentTodayUSD: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      };
      await this.save();
    }
    await this.checkReset();
  }

  async checkReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.state.lastResetDate !== today) {
      this.state.spentTodayUSD = 0;
      this.state.lastResetDate = today;
      await this.save();
    }
  }

  estimateCost(inputTokens, estimatedOutputTokens = 500) {
    const inputCost = (inputTokens / 1000) * RATES.inputTokensPer1k;
    const outputCost = (estimatedOutputTokens / 1000) * RATES.outputTokensPer1k;
    return inputCost + outputCost;
  }

  canAfford(estimatedCost) {
    return (this.state.spentTodayUSD + estimatedCost) <= DAILY_BUDGET_USD;
  }

  getRemaining() {
    return Math.max(0, DAILY_BUDGET_USD - this.state.spentTodayUSD);
  }

  async recordUsage(actualInputTokens, actualOutputTokens) {
    const cost = this.estimateCost(actualInputTokens, actualOutputTokens);
    this.state.spentTodayUSD += cost;
    await this.save();
    return cost;
  }

  async save() {
    await fs.writeFile(BUDGET_FILE, JSON.stringify(this.state, null, 2));
  }

  getStatus() {
    return {
      remaining: this.getRemaining(),
      spent: this.state.spentTodayUSD,
      limit: DAILY_BUDGET_USD,
      blocked: this.state.spentTodayUSD >= DAILY_BUDGET_USD
    };
  }
}

module.exports = new BudgetTracker();
