// src/pages/ReportingDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const ReportingDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [period, setPeriod] = useState('monthly');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    
    // Report Data States
    const [dashboardStats, setDashboardStats] = useState(null);
    const [salesReport, setSalesReport] = useState(null);
    const [productReport, setProductReport] = useState(null);
    const [orderReport, setOrderReport] = useState(null);
    const [userReport, setUserReport] = useState(null);
    const [couponReport, setCouponReport] = useState(null);
    
    // Export States
    const [exportFormat, setExportFormat] = useState('excel');
    const [exporting, setExporting] = useState(false);
    
    // Chart Colors
    const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    const STATUS_COLORS = {
        pending: '#FFB74D',
        confirmed: '#4FC3F7',
        shipped: '#7986CB',
        delivered: '#81C784',
        cancelled: '#E57373'
    };

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        } else if (activeTab === 'sales') {
            fetchSalesReport();
        } else if (activeTab === 'products') {
            fetchProductReport();
        } else if (activeTab === 'orders') {
            fetchOrderReport();
        } else if (activeTab === 'users') {
            fetchUserReport();
        } else if (activeTab === 'coupons') {
            fetchCouponReport();
        }
    }, [activeTab, period, dateRange]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const params = { period };
            if (period === 'custom') {
                params.startDate = dateRange.startDate;
                params.endDate = dateRange.endDate;
            }
            
            const response = await reportsAPI.getDashboardStats(params);
            setDashboardStats(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const fetchSalesReport = async () => {
        try {
            setLoading(true);
            let response;
            
            switch(period) {
                case 'daily':
                    response = await reportsAPI.getDailySalesReport(dateRange.startDate);
                    break;
                case 'weekly':
                    const week = getWeekNumber(new Date(dateRange.startDate));
                    response = await reportsAPI.getWeeklySalesReport(week);
                    break;
                case 'monthly':
                    const month = dateRange.startDate.substring(0, 7);
                    response = await reportsAPI.getMonthlySalesReport(month);
                    break;
                case 'yearly':
                    const year = dateRange.startDate.substring(0, 4);
                    response = await reportsAPI.getYearlySalesReport(year);
                    break;
                case 'custom':
                    response = await reportsAPI.getCustomSalesReport(dateRange);
                    break;
            }
            
            setSalesReport(response.data.data);
        } catch (error) {
            console.error('Error fetching sales report:', error);
            toast.error('Failed to load sales report');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductReport = async () => {
        try {
            setLoading(true);
            const params = { period };
            if (period === 'custom') {
                params.startDate = dateRange.startDate;
                params.endDate = dateRange.endDate;
            }
            
            const response = await reportsAPI.getProductPerformance(params);
            setProductReport(response.data.data);
        } catch (error) {
            console.error('Error fetching product report:', error);
            toast.error('Failed to load product report');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderReport = async () => {
        try {
            setLoading(true);
            const params = { period };
            if (period === 'custom') {
                params.startDate = dateRange.startDate;
                params.endDate = dateRange.endDate;
            }
            
            const response = await reportsAPI.getOrderSummary(params);
            setOrderReport(response.data.data);
        } catch (error) {
            console.error('Error fetching order report:', error);
            toast.error('Failed to load order report');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReport = async () => {
        if (user.role !== 'admin') return;
        
        try {
            setLoading(true);
            const response = await reportsAPI.getUserActivity(period);
            setUserReport(response.data.data);
        } catch (error) {
            console.error('Error fetching user report:', error);
            toast.error('Failed to load user report');
        } finally {
            setLoading(false);
        }
    };

    const fetchCouponReport = async () => {
        if (user.role !== 'admin') return;
        
        try {
            setLoading(true);
            const response = await reportsAPI.getCouponUsage(period);
            setCouponReport(response.data.data);
        } catch (error) {
            console.error('Error fetching coupon report:', error);
            toast.error('Failed to load coupon report');
        } finally {
            setLoading(false);
        }
    };

    // Export Functions
    const handleExport = async (reportType) => {
        try {
            setExporting(true);
            let endpoint, filename;
            
            switch(reportType) {
                case 'sales':
                    endpoint = reportsAPI.exportSalesReport;
                    filename = `sales_report_${period}_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'products':
                    endpoint = reportsAPI.exportProductReport;
                    filename = `product_report_${period}_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'orders':
                    endpoint = reportsAPI.exportOrderReport;
                    filename = `order_report_${period}_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'inventory':
                    endpoint = reportsAPI.exportInventoryReport;
                    filename = `inventory_report_${new Date().toISOString().split('T')[0]}`;
                    break;
            }
            
            const params = {
                period,
                format: exportFormat,
                ...(period === 'custom' && dateRange)
            };
            
            const response = await endpoint(params);
            
            if (exportFormat === 'csv') {
                const blob = new Blob([response.data], { type: 'text/csv' });
                saveAs(blob, `${filename}.csv`);
            } else if (exportFormat === 'excel') {
                saveAs(new Blob([response.data]), `${filename}.xlsx`);
            } else if (exportFormat === 'pdf') {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                saveAs(blob, `${filename}.pdf`);
            } else if (exportFormat === 'json') {
                const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
                saveAs(blob, `${filename}.json`);
            }
            
            toast.success(`Report exported successfully as ${exportFormat.toUpperCase()}`);
        } catch (error) {
            console.error('Error exporting report:', error);
            toast.error('Failed to export report');
        } finally {
            setExporting(false);
        }
    };

    // Utility Functions
    const getWeekNumber = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return `${d.getUTCFullYear()}-W${Math.ceil((((d - yearStart) / 86400000) + 1) / 7)}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Render Components
    const renderDashboard = () => {
        if (!dashboardStats) return null;

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats.summary?.total_orders || 0}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Sales</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(dashboardStats.summary?.total_sales || 0)}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Order Value</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(dashboardStats.summary?.avg_order_value || 0)}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Unique Customers</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats.summary?.unique_customers || 0}
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Trend Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dashboardStats.trend_data || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                    <Area type="monotone" dataKey="orders" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Breakdown */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardStats.status_breakdown || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {dashboardStats.status_breakdown?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Products & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {dashboardStats.top_products?.map((product, index) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{product.category_name}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{product.units_sold}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm font-medium text-green-600">
                                                    {formatCurrency(product.revenue)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Products</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {dashboardStats.low_stock_products?.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{product.sku}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{product.category_name}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.quantity <= 5 ? 'bg-red-100 text-red-800' :
                                                    product.quantity <= 10 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {product.quantity} units
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {(!dashboardStats.low_stock_products || dashboardStats.low_stock_products.length === 0) && (
                            <p className="text-center text-gray-500 py-4">No low stock products</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderSalesReport = () => {
        if (!salesReport) return null;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Summary Cards for Sales */}
                    {[
                        { label: 'Total Orders', value: salesReport.summary?.total_orders || 0, icon: '📊', color: 'blue' },
                        { label: 'Total Sales', value: formatCurrency(salesReport.summary?.total_sales || 0), icon: '💰', color: 'green' },
                        { label: 'Avg Order Value', value: formatCurrency(salesReport.summary?.avg_order_value || 0), icon: '📈', color: 'purple' },
                        { label: 'Unique Customers', value: salesReport.summary?.unique_customers || 0, icon: '👥', color: 'orange' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts for Sales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Time-based Sales Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Over Time</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesReport.trend_data || salesReport.daily_breakdown || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey={salesReport.hourly_trend ? 'hour' : 'date'} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={salesReport.payment_methods || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="amount"
                                    >
                                        {(salesReport.payment_methods || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                        <button
                            onClick={() => handleExport('sales')}
                            disabled={exporting}
                            className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            {exporting ? 'Exporting...' : 'Export Report'}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(salesReport.top_products || []).map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{product.category}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{product.units_sold}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency(product.revenue)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                                {formatCurrency(product.revenue / product.units_sold)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderProductReport = () => {
        if (!productReport) return null;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Performance Summary */}
                    {[
                        { label: 'Total Products', value: productReport.total_products || 0, icon: '📦', color: 'blue' },
                        { label: 'Products Sold', value: productReport.products_sold || 0, icon: '💰', color: 'green' },
                        { label: 'Avg Price', value: formatCurrency(productReport.avg_price || 0), icon: '🏷️', color: 'purple' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Product Performance Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performing Products */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productReport.top_performing_products?.slice(0, 10) || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                                    <Bar dataKey="units_sold" fill="#82ca9d" name="Units Sold" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Performance */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productReport.category_performance || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="sales"
                                    >
                                        {(productReport.category_performance || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [formatCurrency(value), 'Sales']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Product Performance Table */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Product Performance Details</h3>
                        <div className="flex space-x-2">
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="excel">Excel</option>
                                <option value="csv">CSV</option>
                                <option value="pdf">PDF</option>
                                <option value="json">JSON</option>
                            </select>
                            <button
                                onClick={() => handleExport('products')}
                                disabled={exporting}
                                className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                {exporting ? 'Exporting...' : 'Export'}
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {productReport.products?.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{product.category_name}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{product.sku}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{product.units_sold || 0}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency(product.revenue || 0)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                                product.quantity <= 5 ? 'text-red-600' :
                                                product.quantity <= 10 ? 'text-yellow-600' : 'text-green-600'
                                            }`}>
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                product.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderOrderReport = () => {
        if (!orderReport) return null;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Order Summary Cards */}
                    {[
                        { label: 'Total Orders', value: orderReport.total_orders || 0, icon: '📦', color: 'blue' },
                        { label: 'Total Sales', value: formatCurrency(orderReport.total_sales || 0), icon: '💰', color: 'green' },
                        { label: 'Avg Order Value', value: formatCurrency(orderReport.avg_order_value || 0), icon: '📊', color: 'purple' },
                        { label: 'Cancellation Rate', value: `${((orderReport.cancelled_orders || 0) / (orderReport.total_orders || 1) * 100).toFixed(1)}%`, icon: '❌', color: 'red' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Status Distribution */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={orderReport.status_breakdown || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8">
                                        {orderReport.status_breakdown?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={orderReport.timeline_data || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [value, 'Orders']} />
                                    <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                        <button
                            onClick={() => handleExport('orders')}
                            disabled={exporting}
                            className="bg-primary-500 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            {exporting ? 'Exporting...' : 'Export Orders'}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orderReport.recent_orders?.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-blue-600">#{order.order_number}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{order.customer_name || order.user_email}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{order.item_count || 0} items</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency(order.total_amount)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderUserReport = () => {
        if (user.role !== 'admin') {
            return (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h2>
                    <p className="text-gray-600 mb-6">
                        User analytics are only available to administrators.
                    </p>
                </div>
            );
        }

        if (!userReport) return null;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* User Stats Cards */}
                    {[
                        { label: 'Total Users', value: userReport.total_users || 0, icon: '👥', color: 'blue' },
                        { label: 'Active Users', value: userReport.active_users || 0, icon: '✅', color: 'green' },
                        { label: 'New Users', value: userReport.new_users || 0, icon: '🆕', color: 'purple' },
                        { label: 'Avg Orders/User', value: userReport.avg_orders_per_user?.toFixed(1) || 0, icon: '📊', color: 'orange' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Registration Trend */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userReport.registration_trend || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="registrations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Role Distribution */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userReport.role_distribution || []}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {(userReport.role_distribution || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Users Table */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Users by Spending</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {userReport.top_users?.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{user.email}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'seller' ? 'bg-green-100 text-green-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{user.total_orders}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency(user.total_spent)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">
                                                {user.last_order_date ? formatDate(user.last_order_date) : 'Never'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderCouponReport = () => {
        if (user.role !== 'admin') {
            return (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h2>
                    <p className="text-gray-600 mb-6">
                        Coupon analytics are only available to administrators.
                    </p>
                </div>
            );
        }

        if (!couponReport) return null;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Coupon Stats Cards */}
                    {[
                        { label: 'Total Coupons', value: couponReport.total_coupons || 0, icon: '🎫', color: 'blue' },
                        { label: 'Active Coupons', value: couponReport.active_coupons || 0, icon: '✅', color: 'green' },
                        { label: 'Total Usage', value: couponReport.total_usage || 0, icon: '📊', color: 'purple' },
                        { label: 'Total Discount', value: formatCurrency(couponReport.total_discount || 0), icon: '💰', color: 'orange' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupon Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coupon Usage Trend */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Usage Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={couponReport.usage_trend || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [value, 'Usage']} />
                                    <Line type="monotone" dataKey="usage" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="discount" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Most Effective Coupons */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Effective Coupons</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={couponReport.top_coupons?.slice(0, 10) || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="code" angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [value, 'Usage']} />
                                    <Bar dataKey="times_used" fill="#8884d8" name="Times Used" />
                                    <Bar dataKey="orders_generated" fill="#82ca9d" name="Orders Generated" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Performance Details</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Times Used</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Discount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders Generated</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {couponReport.coupons?.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{coupon.code}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{coupon.discount_type}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">${coupon.min_order_amount || 0}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                {coupon.times_used || 0}/{coupon.usage_limit || '∞'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency(coupon.total_discount || 0)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{coupon.orders_generated || 0}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        {user.role === 'admin' ? 'Comprehensive business intelligence and reporting' : 
                         user.role === 'seller' ? 'Sales performance and inventory analytics' : 
                         'View your order history and account activity'}
                    </p>
                </div>

                {/* Period Selector */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Period</label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </div>

                            {period === 'custom' && (
                                <div className="flex space-x-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={dateRange.startDate}
                                            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={dateRange.endDate}
                                            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Export as:</span>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="excel">Excel</option>
                                <option value="csv">CSV</option>
                                <option value="pdf">PDF</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex flex-wrap -mb-px">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                                    activeTab === 'dashboard'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                📊 Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('sales')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                                    activeTab === 'sales'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                💰 Sales Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                                    activeTab === 'products'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                📦 Product Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                                    activeTab === 'orders'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                🚚 Order Reports
                            </button>
                            {user.role === 'admin' && (
                                <>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                                            activeTab === 'users'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        👥 User Analytics
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('coupons')}
                                        className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                                            activeTab === 'coupons'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        🎫 Coupon Analytics
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    /* Content Area */
                    <div className="min-h-[600px]">
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'sales' && renderSalesReport()}
                        {activeTab === 'products' && renderProductReport()}
                        {activeTab === 'orders' && renderOrderReport()}
                        {activeTab === 'users' && renderUserReport()}
                        {activeTab === 'coupons' && renderCouponReport()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportingDashboard;