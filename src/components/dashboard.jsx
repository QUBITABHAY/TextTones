import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../models/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/db";
import AudioPlayer from "./AudioPlayer";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    totalConversions: 0,
    totalCharacters: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const convertBase64ToAudio = (base64String) => {
    if (!base64String) return null;
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mp3' });
    return URL.createObjectURL(blob);
  };

  // Move cleanup function outside useEffect
  const cleanupAudioUrls = useCallback((activities) => {
    activities?.forEach(activity => {
      if (activity.audioUrl && activity.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(activity.audioUrl);
      }
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    let currentUrls = [];
    
    const fetchUserData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!mounted) return;
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          
          // Clean up previous URLs before creating new ones
          cleanupAudioUrls(currentUrls);
          
          // Process recent activity to convert base64 to audio URLs
          const processedActivity = (data.recentActivity || []).map(activity => {
            const audioUrl = activity.audioBase64 ? convertBase64ToAudio(activity.audioBase64) : activity.audioUrl;
            if (audioUrl) {
              currentUrls.push(audioUrl);
            }
            return {
              ...activity,
              audioUrl
            };
          });

          setUserData({
            totalConversions: data.totalConversions || 0,
            totalCharacters: data.totalCharacters || 0,
            recentActivity: processedActivity
          });
        } else {
          setError('No user data found. Try converting some text to see your stats!');
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching user data:', error);
          setError('Error loading your data. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      mounted = false;
      cleanupAudioUrls(currentUrls);
    };
  }, [user, navigate, cleanupAudioUrls]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.displayName || user?.email}!
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profile
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <span className="text-indigo-600 text-lg font-medium">
                      {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900">
              Total Conversions
            </h3>
            <p className="mt-2 text-3xl font-semibold text-indigo-600">
              {userData.totalConversions}
            </p>
          </div>
          <div className="mt-4 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900">
              Characters Used
            </h3>
            <p className="mt-2 text-3xl font-semibold text-indigo-600">
              {userData.totalCharacters}
            </p>
          </div>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="divide-y divide-gray-200">
              {userData.recentActivity && userData.recentActivity.length > 0 ? (
                userData.recentActivity.map((activity, index) => (
                  <div key={index} className="py-4">
                    <p className="text-sm text-gray-600">
                      {activity?.text ? (
                        <>
                          {activity.text.substring(0, 100)}
                          {activity.text.length > 100 ? '...' : ''}
                        </>
                      ) : 'No text available'}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400">
                        Voice: {activity?.voice || 'N/A'} ({activity?.language || 'N/A'})
                      </p>
                      {activity?.audioUrl && (
                        <div className="mt-2">
                          <AudioPlayer src={activity.audioUrl} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {activity?.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Time not available'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-3 text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
