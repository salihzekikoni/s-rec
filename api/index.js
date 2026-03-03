const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const CLAUDE_API_KEY = "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";

app.post('/api/analyze', async (req, res) => {
  try {
    const { processText, apiKey } = req.body;
    const key = apiKey || CLAUDE_API_KEY;

    if (!processText) {
      return res.status(400).json({ error: 'Process text required' });
    }

    const prompt = `Analyze this Turkish business process and respond ONLY with valid JSON (no markdown):

Process: "${processText}"

Response must be ONLY this JSON:
{
  "mermaid": "flowchart TD\\n    Start([Başla]) --> Step1[Adım 1]\\n    Step1 --> Step2[Adım 2]\\n    Step2 --> End([Bitir])",
  "analysis": {
    "pillars": {"human": 75, "system": 80, "process": 78, "operations": 72, "impact": 76},
    "elements": {"lean": 72, "quality": 78, "improvement": 75},
    "recommendations": ["Tavsiye 1", "Tavsiye 2", "Tavsiye 3", "Tavsiye 4", "Tavsiye 5"]
  }
}`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      }
    });

    const content = response.data.content[0].text;
    let analysisData;

    try {
      analysisData = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(500).json({ error: 'Invalid response format' });
      }
    }

    res.json(analysisData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

4. **Commit changes** tıkla

---

## 📝 **Dosya 3: `.gitignore`**

1. **"Add file"** → **"Create new file"**
2. **Filename:** `.gitignore`
3. **Kod:**
```
node_modules/
.env
.vercel
