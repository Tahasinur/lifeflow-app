import { useState } from 'react';
import { X, User, Settings, Users, Upload, Moon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'account' | 'workspace' | 'members';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Guest';
  avatar: string;
}

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'User Name',
    email: 'user@example.com',
    role: 'Admin',
    avatar: 'U',
  },
  {
    id: '2',
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    role: 'Member',
    avatar: 'JC',
  },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [preferredName, setPreferredName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [workspaceName, setWorkspaceName] = useState("User's Workspace");
  const [workspaceSlug, setWorkspaceSlug] = useState('user-workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handlePhotoUpload = () => {
    toast.info('Photo upload coming soon');
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleSaveWorkspace = () => {
    toast.success('Workspace settings saved');
  };

  const handleDeleteWorkspace = () => {
    if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      toast.error('Workspace deletion is not available in demo mode');
    }
  };

  const handleAddMembers = () => {
    toast.info('Invite members feature coming soon');
  };

  const handleRoleChange = (memberId: string, newRole: Member['role']) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success('Member role updated');
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'account' as TabType, label: 'My Account', icon: User },
    { id: 'workspace' as TabType, label: 'Settings', icon: Settings },
    { id: 'members' as TabType, label: 'Members', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-50 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 flex flex-col bg-[#F7F7F5] dark:bg-[#2B2B2B]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-[#37352F] dark:text-white">
              Settings
            </h2>
          </div>
          <nav className="flex-1 p-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-[#37352F] dark:text-white ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#1F1F1F]">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-semibold text-[#37352F] dark:text-white">
              {activeTab === 'account' && 'My Profile'}
              {activeTab === 'workspace' && 'Workspace Settings'}
              {activeTab === 'members' && 'Members'}
            </h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-[#37352F] dark:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* My Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-[#37352F] dark:text-white">
                    Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] text-2xl font-medium">
                      U
                    </div>
                    <button
                      onClick={handlePhotoUpload}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-[#37352F] dark:text-white"
                    >
                      <Upload size={14} className="inline mr-2" />
                      Upload photo
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#37352F] dark:text-white">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-white dark:bg-[#2B2B2B] text-[#37352F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#37352F] dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-white dark:bg-[#2B2B2B] text-[#37352F] dark:text-white"
                  />
                </div>

                {/* Appearance Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-semibold mb-4 text-[#37352F] dark:text-white">
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon size={18} className="text-[#37352F] dark:text-white" />
                      <span className="text-sm text-[#37352F] dark:text-white">
                        Dark Mode
                      </span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        isDark ? 'bg-black dark:bg-white' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                          isDark ? 'translate-x-5 bg-white dark:bg-black' : 'translate-x-0 bg-white'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Workspace Settings Tab */}
            {activeTab === 'workspace' && (
              <div className="space-y-8">
                {/* Workspace Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#37352F] dark:text-white">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-white dark:bg-[#2B2B2B] text-[#37352F] dark:text-white"
                  />
                </div>

                {/* Domain / URL */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#37352F] dark:text-white">
                    Workspace URL
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                    <span className="px-3 py-2 text-sm bg-[#F7F7F5] dark:bg-[#2B2B2B] text-gray-500 dark:text-gray-400">
                      lifeflow.so/
                    </span>
                    <input
                      type="text"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm focus:outline-none bg-white dark:bg-[#2B2B2B] text-[#37352F] dark:text-white"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This is the URL where your workspace can be accessed
                  </p>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#37352F] dark:text-white">
                    Workspace Icon
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] text-xl font-medium">
                      U
                    </div>
                    <button
                      onClick={() => toast.info('Icon picker coming soon')}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-[#37352F] dark:text-white"
                    >
                      Change Icon
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSaveWorkspace}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="pt-8 mt-8 border-t-2 border-red-200 dark:border-red-900">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle size={20} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Deleting your workspace will permanently remove all pages, data, and member access. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteWorkspace}
                    className="px-4 py-2 border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                  >
                    Delete this workspace
                  </button>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage who has access to this workspace
                  </p>
                  <button
                    onClick={handleAddMembers}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Add members
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-white dark:bg-[#2B2B2B] text-[#37352F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Members List */}
                <div className="space-y-0">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between py-4 ${
                          index !== filteredMembers.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] text-sm font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#37352F] dark:text-white">
                              {member.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {member.email}
                            </div>
                          </div>
                        </div>
                        {member.role === 'Admin' ? (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#F7F7F5] dark:bg-[#2B2B2B] text-[#37352F] dark:text-white">
                            Admin
                          </span>
                        ) : (
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value as Member['role'])}
                            className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-white dark:bg-[#2B2B2B] text-[#37352F] dark:text-white"
                          >
                            <option value="Member">Member</option>
                            <option value="Guest">Guest</option>
                            <option value="Admin">Admin</option>
                          </select>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No members found
                      </p>
                    </div>
                  )}
                </div>

                {filteredMembers.length === members.length && members.length <= 2 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No other members yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
