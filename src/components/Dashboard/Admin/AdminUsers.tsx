import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ShieldCheck,
  Mail,
  X,
  CheckCircle2,
  ArrowUpRight,
  Shield,
  UserPlus,
  Lock,
  Eye,
  Settings2
} from 'lucide-react';
import { adminUsersStorage, adminRolesStorage } from '../../../utils/storage';

const initialAdminUsers = [
  { id: 1, name: 'Mason Elpi', email: 'elpi@example.com', role: 'Super Admin', status: 'Accepted', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/a1/100/100' },
  { id: 2, name: 'Amanda Lance', email: 'lance@example.com', role: 'Admin', status: 'Pending', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/a2/100/100' },
  { id: 3, name: 'Bolu Ahmed', email: 'bolu@example.com', role: 'Admin', status: 'Accepted', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/a3/100/100' },
  { id: 4, name: 'Lilian Okoh', email: 'lilian@example.com', role: 'Admin', status: 'Accepted', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/a4/100/100' },
  { id: 5, name: 'John Chidiebere', email: 'john@example.com', role: 'Admin', status: 'Accepted', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/a5/100/100' },
];

const initialAdminRoles = [
  { id: 1, name: 'Super Admin', users: 2, permissions: 'Full Access', date: 'Jan 6, 2022 4:26 PM' },
  { id: 2, name: 'Admin', users: 10, permissions: 'Limited Access', date: 'Jan 6, 2022 4:26 PM' },
  { id: 3, name: 'Counselor', users: 5, permissions: 'View Only', date: 'Jan 6, 2022 4:26 PM' },
];

const PermissionToggle: React.FC<{ action: string }> = ({ action }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div 
      onClick={() => setIsActive(!isActive)}
      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
    >
      <span className="text-xs font-bold text-slate-500">Can {action}</span>
      <div className={`relative inline-block w-10 h-5 rounded-full transition-colors ${isActive ? 'bg-brand' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isActive ? 'right-1' : 'left-1'}`}></div>
      </div>
    </div>
  );
};

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Admin' });
  const [newRole, setNewRole] = useState({ name: '', permissions: 'Limited Access' });

  useEffect(() => {
    setUsers(adminUsersStorage.get(initialAdminUsers));
    setRoles(adminRolesStorage.get(initialAdminRoles));
  }, []);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const user = {
      id: Date.now(),
      ...newUser,
      status: 'Accepted',
      date: new Date().toLocaleString(),
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
    };
    const updated = [...users, user];
    setUsers(updated);
    adminUsersStorage.save(updated);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Admin' });
  };

  const handleAddRole = () => {
    if (!newRole.name) return;
    const role = {
      id: Date.now(),
      ...newRole,
      users: 0,
      date: new Date().toLocaleString()
    };
    const updated = [...roles, role];
    setRoles(updated);
    adminRolesStorage.save(updated);
    setIsAddRoleModalOpen(false);
    setNewRole({ name: '', permissions: 'Limited Access' });
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      adminUsersStorage.save(updated);
    }
  };

  const handleDeleteRole = (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      const updated = roles.filter(r => r.id !== id);
      setRoles(updated);
      adminRolesStorage.save(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage administrative users, roles, and permissions.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'users' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            Admin Users
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'roles' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            Admin Roles
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: 'Total Admin Users', value: '10', icon: ShieldCheck, color: 'text-brand', bg: 'bg-brand/10' },
          { label: 'Total Roles', value: '5', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search admin users..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm"
              />
            </div>
            <button 
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
            >
              <UserPlus className="w-5 h-5" /> Add Admin User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Added</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-bold text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500">{user.email}</td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'Accepted' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-500">{user.date}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Admin Roles</h2>
            <button 
              onClick={() => setIsAddRoleModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-5 h-5" /> Add New Role
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role Name</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Admin Users</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Permissions</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Added</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-900">{role.name}</td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center -space-x-2">
                        {[1, 2, 3].map(i => (
                          <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">+{role.users - 3}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-xs font-bold text-brand hover:underline">View Permissions</button>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{role.date}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all">
                          <Settings2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Add Admin User</h2>
                  <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Name</label>
                    <input 
                      type="text" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Mason Elpi" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                    <input 
                      type="email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="admin@oaicc.com" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Role</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Counselor">Counselor</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={() => setIsAddUserModalOpen(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleAddUser} className="py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">Add User</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Role Modal */}
      <AnimatePresence>
        {isAddRoleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddRoleModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 sm:p-12">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-slate-900">Add new role</h2>
                  <div className="flex gap-4">
                    <button onClick={() => setIsAddRoleModalOpen(false)} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleAddRole} className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">Save</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Name of role</label>
                      <input 
                        type="text" 
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        placeholder="e.g. IT specialist" 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Description <span className="text-slate-400 text-xs font-medium">(Optional)</span></label>
                      <textarea rows={4} placeholder="Please enter a description" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none" />
                    </div>
                  </div>

                    <div className="space-y-8">
                    <h3 className="text-lg font-bold text-slate-900">Assign permissions</h3>
                    <div className="space-y-6">
                      {['Career', 'Interest Quiz', 'Forum', 'Mentor', 'Events', 'Counselor', 'Admin Management'].map((perm) => (
                        <div key={perm} className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-700">{perm}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {['View', 'Create', 'Edit', 'Delete'].map((action) => (
                              <PermissionToggle key={action} action={action} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
