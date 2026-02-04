import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI, userAPI, reviewAPI, artisanAPI } from '../services/api';
import { Users, MessageSquare, TrendingUp, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminPanel() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        checkAdminAccess();
        loadData();
    }, []);

    const checkAdminAccess = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            if (response.data.user.role !== 'admin') {
                navigate('/');
            }
        } catch (error) {
            navigate('/login');
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, reviewsRes] = await Promise.all([
                artisanAPI.getStats(),
                userAPI.getAllUsers(),
                reviewAPI.getAll()
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data.users || []);
            setReviews(reviewsRes.data.reviews || []);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatusToggle = async (userId, currentStatus) => {
        try {
            await userAPI.updateUserStatus(userId, !currentStatus);
            loadData();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            try {
                await userAPI.deleteUser(userId);
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleReviewApproval = async (reviewId, isApproved) => {
        try {
            await reviewAPI.approve(reviewId, isApproved);
            loadData();
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            try {
                await reviewAPI.delete(reviewId);
                loadData();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>

            {/* Stats Overview */}
            {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{t('admin.totalUsers')}</p>
                                <p className="text-3xl font-bold">{stats.totalArtisans || 0}</p>
                            </div>
                            <Users className="w-12 h-12 text-primary-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{t('admin.totalReviews')}</p>
                                <p className="text-3xl font-bold">{reviews.length}</p>
                            </div>
                            <MessageSquare className="w-12 h-12 text-primary-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{t('admin.avgRating')}</p>
                                <p className="text-3xl font-bold">{stats.averageRating?.toFixed(1) || '0.0'}</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-primary-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {t('admin.overview')}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {t('admin.users')}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {t('admin.reviews')}
                    </button>
                </nav>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('admin.name')}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('admin.email')}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('admin.role')}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('admin.status')}
                                </th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('admin.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {user.isActive ? t('admin.active') : t('admin.inactive')}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">{review.client?.fullName}</span>
                                        <span className="text-gray-500">→</span>
                                        <span className="text-gray-700">{review.artisan?.fullName}</span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {!review.isApproved && (
                                        <>
                                            <button
                                                onClick={() => handleReviewApproval(review._id, true)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleReviewApproval(review._id, false)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDeleteReview(review._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
