import React from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Leads } from "../pages/leads/Leads";
import { Clients } from "../pages/clients/Clients";
import { Settings } from "../pages/settings/Settings";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";

import { ProtectedRoute } from "./ProtectedRoute";

export const routes = [
  // 🚀 ALWAYS send "/" to login
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // =========================
  // Public Routes
  // =========================
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // =========================
  // Protected Routes
  // =========================
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/leads",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Leads />,
      },
    ],
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Clients />,
      },
    ],
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Settings />,
      },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];
