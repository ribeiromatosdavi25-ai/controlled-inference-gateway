const express = require('express');
const cors = require('cors');
const budgetTracker = require('./budgetTracker');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize budget tracker
budgetTracker.init();

app.get('/api/budget', (req, res) => {
  res.json(budgetTracker.getStatus());
});

app.post('/api/review', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Estimate cost
  const inputTokens = Math.ceil(code.length / 4);
  const estimatedCost = budgetTracker.estimateCost(inputTokens);

  // Check budget
  if (!budgetTracker.canAfford(estimatedCost)) {
    return res.status(429).json({
      error: 'Daily budget exceeded',
      status: budgetTracker.getStatus()
    });
  }

  // TODO: Sanitize + call LLM (next step)
  
  res.json({
    message: 'Budget check passed',
    estimatedCost,
    budgetStatus: budgetTracker.getStatus()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

#### 2.4 `backend/.env.example`
```
ANTHROPIC_API_KEY=your_key_here
DEMO_MODE=full
```

#### 2.5 `backend/.gitignore`
```
node_modules/
budget.json
.env
