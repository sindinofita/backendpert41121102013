const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Path menuju file JSON
const dataFilePath = 'data.json';

// Mendapatkan data dari file JSON
async function getData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

// Menyimpan data ke dalam file JSON
async function saveData(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Data saved successfully.');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Menyambut permintaan ke root URL
app.get('/', (req, res) => {
  res.send('Welcome to the REST API!');
});

// Mendapatkan semua item
app.get('/items', async (req, res) => {
  const data = await getData();
  res.json(data);
});

// Menambahkan item baru
app.post('/items', async (req, res) => {
  const newItem = req.body;
  const data = await getData();
  data.push(newItem);
  await saveData(data);
  res.json(newItem);
});

// Menampilkan detail item berdasarkan ID
app.get('/items/:id', async (req, res) => {
  const { id } = req.params;
  const data = await getData();
  const item = data.find(item => item.id === parseInt(id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found.');
  }
});

// Menyambut permintaan PUT untuk memperbarui item berdasarkan ID
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  let data = await getData();
  const index = data.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    data[index] = { ...data[index], ...newData };
    await saveData(data);
    res.json(data[index]);
  } else {
    res.status(404).send('Item not found.');
  }
});


// Menghapus item berdasarkan ID
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  let data = await getData();
  data = data.filter(item => item.id !== parseInt(id));
  await saveData(data);
  res.send('Item deleted successfully.');
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
