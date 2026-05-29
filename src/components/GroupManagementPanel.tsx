import React, { useState } from 'react';

interface GroupMember {
  id: string;
  nickname?: string;
  role: 'host' | 'admin' | 'moderator' | 'member';
  isOnline: boolean;
  joinedAt: number;
}

interface GroupManagementPanelProps {
  isHost: boolean;
  currentUserId: string;
  members: GroupMember[];
  onPromoteToAdmin: (userId: string) => void;
  onPromoteToModerator: (userId: string) => void;
  onDemote: (userId: string) => void;
  onMute: (userId: string) => void;
  onKick: (userId: string) => void;
  onBan: (userId: string) => void;
  onClose: () => void;
}

const GroupManagementPanel: React.FC<GroupManagementPanelProps> = ({
  isHost,
  currentUserId,
  members,
  onPromoteToAdmin,
  onPromoteToModerator,
  onDemote,
  onMute,
  onKick,
  onBan,
  onClose
}) => {
  const [groupInfo, setGroupInfo] = useState({
    name: 'Secure Group',
    description: 'End-to-end encrypted group chat',
    rules: 'Be respectful and follow community guidelines',
    maxMembers: 100
  });
  const [activeTab, setActiveTab] = useState<'members' | 'settings' | 'permissions'>('members');

  const getRoleBadge = (role: string) => {
    const badges = {
      host: { emoji: '👑', color: 'bg-yellow-100 text-yellow-800', label: 'Host' },
      admin: { emoji: '⭐', color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      moderator: { emoji: '🛡️', color: 'bg-blue-100 text-blue-800', label: 'Mod' },
      member: { emoji: '👤', color: 'bg-gray-100 text-gray-800', label: 'Member' }
    };
    return badges[role as keyof typeof badges] || badges.member;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Group Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-600 dark:text-gray-400'
            }`}
          >
            👥 Members ({members.length})
          </button>
          {isHost && (
            <>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'permissions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
              >
                🔐 Permissions
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'members' && (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {member.nickname || `User ${member.id.substring(0, 8)}`}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(member.role).color}`}>
                          {getRoleBadge(member.role).emoji} {getRoleBadge(member.role).label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {member.id !== currentUserId && (isHost || member.role === 'member') && (
                    <div className="flex items-center space-x-2">
                      {isHost && member.role === 'member' && (
                        <>
                          <button
                            onClick={() => onPromoteToModerator(member.id)}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                            title="Promote to Moderator"
                          >
                            🛡️
                          </button>
                          <button
                            onClick={() => onPromoteToAdmin(member.id)}
                            className="text-xs bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600"
                            title="Promote to Admin"
                          >
                            ⭐
                          </button>
                        </>
                      )}
                      {isHost && (member.role === 'admin' || member.role === 'moderator') && (
                        <button
                          onClick={() => onDemote(member.id)}
                          className="text-xs bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                        >
                          Demote
                        </button>
                      )}
                      <button
                        onClick={() => onMute(member.id)}
                        className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600"
                        title="Mute"
                      >
                        🔇
                      </button>
                      <button
                        onClick={() => onKick(member.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        title="Kick"
                      >
                        👢
                      </button>
                      {isHost && (
                        <button
                          onClick={() => onBan(member.id)}
                          className="text-xs bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-800"
                          title="Ban"
                        >
                          🚫
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && isHost && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupInfo.name}
                  onChange={(e) => setGroupInfo({ ...groupInfo, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={groupInfo.description}
                  onChange={(e) => setGroupInfo({ ...groupInfo, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Group Rules
                </label>
                <textarea
                  value={groupInfo.rules}
                  onChange={(e) => setGroupInfo({ ...groupInfo, rules: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  value={groupInfo.maxMembers}
                  onChange={(e) => setGroupInfo({ ...groupInfo, maxMembers: parseInt(e.target.value) })}
                  min={2}
                  max={500}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600">
                Save Settings
              </button>
            </div>
          )}

          {activeTab === 'permissions' && isHost && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-3">Member Permissions</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can send messages</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can send files</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can send links</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can send stickers/GIFs</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can create polls</span>
                    <input type="checkbox" className="w-5 h-5" />
                  </label>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-3">Moderator Permissions</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can delete messages</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can mute members</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can pin messages</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-3">Admin Permissions</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can manage members</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can change settings</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Can promote moderators</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupManagementPanel;
