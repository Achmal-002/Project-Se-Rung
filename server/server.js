import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);

// Sample warung route (sementara)
app.get('/api/warungs', (req, res) => {
  const warungs = [
    {
      id: "1",
      name: "Warung Makan Enak",
      location: { lat: -6.2088, lng: 106.8456 },
      address: "Jl. Lokasi Warung Makan Enak, Area Sekitar",
      rating: 4.7,
      distance: "1.1 km",
      category: "Warung Makan",
      _id: "1"
    },
    {
      id: "2",
      name: "Kedai Minuman Segar", 
      location: { lat: -6.2188, lng: 106.8356 },
      address: "Jl. Lokasi Kedai Minuman Segar, Area Sekitar",
      rating: 4.6,
      distance: "1.1 km",
      category: "Minuman",
      _id: "2"
    }
  ];
  res.json(warungs);
});

// Tambahkan route untuk get warung by ID (sementara)
app.get('/api/warungs/:id', (req, res) => {
  const warungs = [
    {
      id: "1",
      name: "Warung Makan Enak",
      location: { 
        address: "Jl. Lokasi Warung Makan Enak, Area Sekitar",
        coordinates: { lat: -6.2088, lng: 106.8456 }
      },
      rating: 4.7,
      isOpen: true,
      _id: "1"
    },
    {
      id: "2",
      name: "Kedai Minuman Segar", 
      location: { 
        address: "Jl. Lokasi Kedai Minuman Segar, Area Sekitar",
        coordinates: { lat: -6.2188, lng: 106.8356 }
      },
      rating: 4.6,
      isOpen: true,
      _id: "2"
    }
  ];
  
  const warung = warungs.find(w => w._id === req.params.id);
  if (warung) {
    res.json(warung);
  } else {
    res.status(404).json({ message: 'Warung tidak ditemukan' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🏪 Demo mode: Using in-memory storage`);
});