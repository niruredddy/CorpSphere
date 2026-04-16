import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import SystemAdminDash from './SystemAdminDash';
import OrgOwnerDash from './OrgOwnerDash';
import MemberDash from './MemberDash';
import Layout from '../components/Layout';
import UserProfile from './UserProfile';

const DashboardRouter = () => {
    const { user } = useAuth();

    let DashboardComponent;
    if (user?.role === 'SYSTEM_ADMIN') {
        DashboardComponent = SystemAdminDash;
    } else if (user?.role === 'ORG_OWNER') {
        DashboardComponent = OrgOwnerDash;
    } else {
        DashboardComponent = MemberDash;
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardComponent />} />
                <Route path="/profile" element={<UserProfile />} />
            </Routes>
        </Layout>
    );
};

export default DashboardRouter;
