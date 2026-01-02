
import { create } from 'zustand';
import { User, Customer, Job, InventoryItem, Invoice, UserRole, JobStatus, Priority, InvoiceStatus, BlogPost } from '../types';
import { MOCK_USERS } from '../constants';

interface AppState {
  user: User | null;
  customers: Customer[];
  jobs: Job[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  blogPosts: BlogPost[];
  loading: boolean;
  
  // Auth Actions
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  
  // Data Actions
  addCustomer: (customer: Customer) => void;
  addJob: (job: Job) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  addInventory: (item: InventoryItem) => void;
  updateInventoryStock: (itemId: string, newStock: number) => void;
  addInvoice: (invoice: Invoice) => void;
  recordPayment: (invoiceId: string, payment: { amount: number; date: string; method: string; ref?: string }) => void;
  addBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  customers: [
    {
      id: 'C001',
      name: 'John Mensah',
      phone: '0244123456',
      email: 'john.mensah@email.gh',
      vehicle: { make: 'Toyota', model: 'Camry', year: '2015', plateNumber: 'GR-1234-15' },
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'C002',
      name: 'Sarah Osei',
      phone: '0558765432',
      email: 's.osei@business.gh',
      vehicle: { make: 'Hyundai', model: 'Elantra', year: '2018', plateNumber: 'GW-5521-20' },
      createdAt: '2024-02-10T14:30:00Z'
    },
    {
      id: 'C003',
      name: 'Kwame Boateng',
      phone: '0201239876',
      email: 'boateng.k@gmail.com',
      vehicle: { make: 'Nissan', model: 'Patrol', year: '2020', plateNumber: 'GE-9988-21' },
      createdAt: '2024-03-05T09:15:00Z'
    },
    {
      id: 'C004',
      name: 'Abena Appiah',
      phone: '0244998877',
      vehicle: { make: 'Honda', model: 'Civic', year: '2014', plateNumber: 'AS-441-14' },
      createdAt: '2024-04-12T11:45:00Z'
    },
    {
      id: 'C005',
      name: 'Emmanuel Tetteh',
      phone: '0543210987',
      email: 'tetteh.fix@web.com',
      vehicle: { make: 'Mercedes-Benz', model: 'C200', year: '2016', plateNumber: 'GT-7722-16' },
      createdAt: '2024-05-20T16:20:00Z'
    }
  ],
  jobs: [
    {
      id: 'J001',
      customerId: 'C001',
      customerName: 'John Mensah',
      vehicleInfo: 'Toyota Camry (GR-1234-15)',
      issueDescription: 'Brake pads making grinding noise during stops',
      status: JobStatus.COMPLETED,
      priority: Priority.HIGH,
      assignedMechanic: 'Kwame',
      estimatedCost: 450,
      parts: [{ id: 'I002', name: 'Brake Pads (Toyota)', quantity: 1, price: 350 }],
      laborHours: 2,
      laborRate: 50,
      createdAt: '2024-05-15T09:00:00Z'
    },
    {
      id: 'J002',
      customerId: 'C002',
      customerName: 'Sarah Osei',
      vehicleInfo: 'Hyundai Elantra (GW-5521-20)',
      issueDescription: 'Engine overheating on long drives',
      status: JobStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      assignedMechanic: 'Kofi',
      estimatedCost: 1200,
      parts: [],
      laborHours: 5,
      laborRate: 60,
      createdAt: '2024-05-18T10:30:00Z'
    },
    {
      id: 'J003',
      customerId: 'C005',
      customerName: 'Emmanuel Tetteh',
      vehicleInfo: 'Mercedes C200 (GT-7722-16)',
      issueDescription: 'Transmission fluid leak detected in garage',
      status: JobStatus.PENDING,
      priority: Priority.HIGH,
      assignedMechanic: 'Yaw',
      estimatedCost: 2500,
      parts: [],
      laborHours: 8,
      laborRate: 80,
      createdAt: '2024-05-19T15:00:00Z'
    }
  ],
  inventory: [
    { id: 'I001', name: 'Engine Oil (Synthetic 5W-30)', category: 'Oils', stock: 12, reorderLevel: 5, unitCost: 120, sellingPrice: 180 },
    { id: 'I002', name: 'Brake Pads (Toyota Front)', category: 'Brake Parts', stock: 2, reorderLevel: 5, unitCost: 200, sellingPrice: 350 },
    { id: 'I003', name: 'Oil Filter (Hyundai)', category: 'Filters', stock: 25, reorderLevel: 10, unitCost: 45, sellingPrice: 85 }
  ],
  invoices: [],
  blogPosts: [
    { 
      id: '1', 
      title: "How AI is Changing Auto Repair in Ghana's Local Workshops", 
      content: "Brief content preview...", 
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800",
      category: "Technology",
      date: "May 22, 2024",
      readTime: "4 min read"
    },
    { 
      id: '2', 
      title: "Top 5 Brake Maintenance Tips for Ghana's Pothole-Heavy Roads", 
      content: "Brief content preview...", 
      image: "https://images.unsplash.com/photo-1506774135304-22820c280f2b?auto=format&fit=crop&q=80&w=800",
      category: "Maintenance",
      date: "May 18, 2024",
      readTime: "3 min read"
    }
  ],
  loading: false,

  login: (email, role) => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role) || MOCK_USERS[0];
    set({ user: foundUser });
  },
  logout: () => set({ user: null }),

  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJobStatus: (jobId, status) => set((state) => ({
    jobs: state.jobs.map(j => j.id === jobId ? { ...j, status } : j)
  })),
  addInventory: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  updateInventoryStock: (itemId, newStock) => set((state) => ({
    inventory: state.inventory.map(i => i.id === itemId ? { ...i, stock: newStock } : i)
  })),
  addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
  recordPayment: (invoiceId, payment) => set((state) => ({
    invoices: state.invoices.map(inv => {
      if (inv.id === invoiceId) {
        const newPayments = [...inv.payments, payment];
        const totalPaid = newPayments.reduce((acc, p) => acc + p.amount, 0);
        const status = totalPaid >= inv.grandTotal ? InvoiceStatus.PAID : inv.status;
        return { ...inv, payments: newPayments, status };
      }
      return inv;
    })
  })),
  addBlogPost: (post) => set((state) => ({ blogPosts: [post, ...state.blogPosts] })),
  deleteBlogPost: (id) => set((state) => ({ blogPosts: state.blogPosts.filter(p => p.id !== id) }))
}));
