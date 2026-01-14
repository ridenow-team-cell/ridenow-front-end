"use client"
import React, { useState } from 'react';
import { Calendar, ChevronDown, Search, Plus, MoreVertical, Trash2, Edit, PlusCircle, User, Mail, Key, Check } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import BaseModal from '@/components/ui/modals/BaseModal';

// Types
interface Role {
    id: number;
    sn: number;
    role: string;
    description: string;
}

interface UserRole {
    id: number;
    userId: string;
    username: string;
    email: string;
    assignedBy: string;
    roleAssigned: string;
    dateAssigned: string;
}

interface Permission {
    id: number;
    name: string;
    module: string;
    checked: boolean;
}

const ManageRolesPage = () => {
    const [activeTab, setActiveTab] = useState<'createRole' | 'inviteUser' | 'manageUser' | 'permissionMapping'>('createRole');

    // Modal states
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form states
    const [roleForm, setRoleForm] = useState({
        role: '',
        description: ''
    });

    const [inviteForm, setInviteForm] = useState({
        role: '',
        email: ''
    });

    const [userForm, setUserForm] = useState({
        userId: '',
        email: '',
        username: '',
        assignedBy: '',
        role: '',
        dateAssigned: ''
    });

    const [permissions, setPermissions] = useState<Permission[]>([
        { id: 1, name: 'Can Approve Request', module: 'Approval', checked: false },
        { id: 2, name: 'Can Manage Busses', module: 'Management', checked: true },
        { id: 3, name: 'Can Assign Task', module: 'Task', checked: false },
        { id: 4, name: 'Can Create Ticket', module: 'Support', checked: false },
        { id: 5, name: 'Can Submit Issues', module: 'Support', checked: true },
        { id: 6, name: 'Can Create Role', module: 'Admin', checked: false },
        { id: 7, name: 'Can Invite Users', module: 'Admin', checked: false },
        { id: 8, name: 'Can Manage Users', module: 'Admin', checked: false },
        { id: 9, name: 'Can Create Permissions', module: 'Admin', checked: true },
        { id: 10, name: 'Can Manage Drivers', module: 'Management', checked: false },
        { id: 11, name: 'Can Generate Report', module: 'Reports', checked: false },
        { id: 12, name: 'Can Block Users', module: 'Admin', checked: true },
        { id: 13, name: 'Can Manage Profile', module: 'Profile', checked: false },
    ]);

    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([
        { id: 1, name: 'Can Approve Request', module: 'Approval', checked: true },
        { id: 3, name: 'Can Assign Task', module: 'Task', checked: true },
        { id: 7, name: 'Can Invite Users', module: 'Admin', checked: true },
    ]);

    const [selectedRole, setSelectedRole] = useState('Admin');

    // Sample data
    const rolesData: Role[] = [
        { id: 1, sn: 1, role: 'Admin', description: 'Lorem ipsum dolor sit amet' },
        { id: 2, sn: 2, role: 'Customer Support', description: 'Lorem ipsum dolor sit amet' },
        { id: 3, sn: 3, role: 'Billing', description: 'Lorem ipsum dolor sit amet' },
        { id: 4, sn: 4, role: 'Admin', description: 'Lorem ipsum dolor sit amet' },
    ];

    const usersData: UserRole[] = [
        { id: 1, userId: 'nile/23_002', username: 'Musa Danjuma', email: 'musa@xyz', assignedBy: 'Jubril', roleAssigned: 'Admin', dateAssigned: 'DD/MM/YYYY' },
        { id: 2, userId: 'nile/23_002', username: 'Musa Danjuma', email: 'musa@xyz', assignedBy: 'Jubril', roleAssigned: 'Super Admin', dateAssigned: 'DD/MM/YYYY' },
        { id: 3, userId: 'nile/23_002', username: 'Musa Danjuma', email: 'musa@xyz', assignedBy: 'Jubril', roleAssigned: 'Customer Support', dateAssigned: 'DD/MM/YYYY' },
        { id: 4, userId: 'nile/23_002', username: 'Musa Danjuma', email: 'musa@xyz', assignedBy: 'Jubril', roleAssigned: 'Billing', dateAssigned: 'DD/MM/YYYY' },
    ];

    // Table columns
    const roleColumns = [
        { key: 'sn', header: 'S/N' },
        { key: 'role', header: 'Role' },
        { key: 'description', header: 'Description' },
    ];

    const userColumns = [
        { key: 'userId', header: 'User ID' },
        { key: 'username', header: 'UserName' },
        { key: 'email', header: 'Email' },
        { key: 'assignedBy', header: 'Assigned By' },
        { key: 'roleAssigned', header: 'Role Assigned' },
        { key: 'dateAssigned', header: 'Date Assigned' },
    ];

    // Handlers
    const handleRoleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRoleForm({ ...roleForm, [e.target.name]: e.target.value });
    };

    const handleInviteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
    };

    const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value });
    };

    const handlePermissionToggle = (id: number) => {
        setPermissions(permissions.map(permission =>
            permission.id === id ? { ...permission, checked: !permission.checked } : permission
        ));
    };

    const handleSelectedPermissionToggle = (id: number) => {
        setSelectedPermissions(selectedPermissions.map(permission =>
            permission.id === id ? { ...permission, checked: !permission.checked } : permission
        ));
    };

    const handleAddRole = () => {
        console.log('Adding role:', roleForm);
        setShowAddRoleModal(false);
        setShowSuccessModal(true);
        setRoleForm({ role: '', description: '' });
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    const handleInviteUser = () => {
        console.log('Inviting user:', inviteForm);
        setShowInviteModal(false);
        setShowSuccessModal(true);
        setInviteForm({ role: '', email: '' });
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    const handleAddUser = () => {
        console.log('Adding user:', userForm);
        setShowAddUserModal(false);
        setShowSuccessModal(true);
        setUserForm({ userId: '', email: '', username: '', assignedBy: '', role: '', dateAssigned: '' });
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    const handleAddPermission = () => {
        console.log('Adding permission for role:', selectedRole);
        setShowAddPermissionModal(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    const handleDelete = () => {
        console.log('Deleting item');
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);
    };

    const roleActions = [
        {
            label: 'Update',
            onClick: (role: Role) => {
                setRoleForm({ role: role.role, description: role.description });
                setShowAddRoleModal(true);
            },
            icon: <Edit size={16} />
        },
        {
            label: 'Delete',
            onClick: (role: Role) => setShowDeleteModal(true),
            icon: <Trash2 size={16} />,
            className: 'text-red-500'
        }
    ];

    const userActions = [
        {
            label: 'Edit User',
            onClick: (user: UserRole) => {
                setUserForm({
                    userId: user.userId,
                    email: user.email,
                    username: user.username,
                    assignedBy: user.assignedBy,
                    role: user.roleAssigned,
                    dateAssigned: user.dateAssigned
                });
                setShowAddUserModal(true);
            },
            icon: <Edit size={16} />
        },
        {
            label: 'Delete User',
            onClick: () => setShowDeleteModal(true),
            icon: <Trash2 size={16} />,
            className: 'text-red-500'
        }
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('createRole')}
                        className={`px-6 py-4 text-base font-medium whitespace-nowrap relative ${activeTab === 'createRole' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Create Role
                        {activeTab === 'createRole' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('inviteUser')}
                        className={`px-6 py-4 text-base font-medium whitespace-nowrap relative ${activeTab === 'inviteUser' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Invite New User
                        {activeTab === 'inviteUser' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('manageUser')}
                        className={`px-6 py-4 text-base font-medium whitespace-nowrap relative ${activeTab === 'manageUser' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Manage User
                        {activeTab === 'manageUser' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('permissionMapping')}
                        className={`px-6 py-4 text-base font-medium whitespace-nowrap relative ${activeTab === 'permissionMapping' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Role Permission Mapping
                        {activeTab === 'permissionMapping' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'createRole' && (
                <div className="space-y-6">
                    <FilterSection
                        onAdd={() => setShowAddRoleModal(true)}
                        showAddButton={true}
                        addButtonText="Create Role"
                    />

                    <DataTable
                        columns={roleColumns}
                        data={rolesData}
                        actions={roleActions}
                    />
                </div>
            )}

            {activeTab === 'inviteUser' && (



                <div className="bg-white min-h-[500px] flex items-center justify-center rounded-lg p-6 w-full">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className=" text-gray-700 text-sm font-medium mb-2">Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={inviteForm.role}
                                    onChange={handleInviteFormChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] appearance-none focus:outline-none focus:border-[#0066CC] pr-10"
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Customer Support">Customer Support</option>
                                    <option value="Billing">Billing</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className=" text-gray-700 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={inviteForm.email}
                                onChange={handleInviteFormChange}
                                placeholder="Type Email Address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC]"
                            />
                        </div>
                        <div className="pt-4">
                            <p className="text-sm text-gray-600 mb-2">Invitation Link</p>
                            <div className="p-3 bg-gray-50 border-1 border-[#0066CC] rounded-lg">
                                <p className="text-gray-700 break-all">https://need2fix/23/ikd/lg</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInviteUser}
                                className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3]"
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>

            )
            }

            {
                activeTab === 'manageUser' && (
                    <div className="space-y-6">
                        <FilterSection
                            onAdd={() => setShowAddUserModal(true)}
                            showAddButton={true}
                            addButtonText="Add User"
                        />

                        <DataTable
                            columns={userColumns}
                            data={usersData}
                            actions={userActions}
                        />
                    </div>
                )
            }

            {
                activeTab === 'permissionMapping' && (
                    <div className="space-y-6">
                        <FilterSection
                            onAdd={() => setShowAddPermissionModal(true)}
                            showAddButton={true}
                            addButtonText="Add Permission"
                        />

                        <div className="bg-white rounded-lg p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:mb-0">Role: {selectedRole}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 appearance-none pr-10 focus:outline-none focus:border-[#0066CC]"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Super Admin">Super Admin</option>
                                            <option value="Customer Support">Customer Support</option>
                                            <option value="Billing">Billing</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-4">Available Permissions</h4>
                                    <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                                        {permissions.map((permission) => (
                                            <label key={permission.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={permission.checked}
                                                    onChange={() => handlePermissionToggle(permission.id)}
                                                    className="w-4 h-4 text-[#0066CC] rounded focus:ring-[#0066CC]"
                                                />
                                                <span className="text-gray-700">{permission.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-4">Assigned Permissions</h4>
                                    <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                                        {selectedPermissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={permission.checked}
                                                        onChange={() => handleSelectedPermissionToggle(permission.id)}
                                                        className="w-4 h-4 text-[#0066CC] rounded focus:ring-[#0066CC]"
                                                    />
                                                    <span className="text-gray-700">{permission.name}</span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <button className="text-[#0066CC] hover:text-[#0052a3]">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="text-red-500 hover:text-red-600">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Add Role Modal */}
            <BaseModal
                isOpen={showAddRoleModal}
                onClose={() => setShowAddRoleModal(false)}
                title="Create Role"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Role Name</label>
                        <input
                            type="text"
                            name="role"
                            value={roleForm.role}
                            onChange={handleRoleFormChange}
                            placeholder="Type role name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={roleForm.description}
                            onChange={handleRoleFormChange}
                            placeholder="Type description"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC] resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowAddRoleModal(false)}
                            className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddRole}
                            className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3]"
                        >
                            Add Role
                        </button>
                    </div>
                </div>
            </BaseModal>



            {/* Add Permission Modal */}
            <BaseModal
                isOpen={showAddPermissionModal}
                onClose={() => setShowAddPermissionModal(false)}
                title="Add Permission"
                size="lg"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Select Role</label>
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-[#0066CC] pr-10"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Customer Support">Customer Support</option>
                                <option value="Billing">Billing</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-4">Permission / Modules</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={permission.checked}
                                        onChange={() => handlePermissionToggle(permission.id)}
                                        className="w-4 h-4 text-[#0066CC] rounded focus:ring-[#0066CC]"
                                    />
                                    <span className="text-gray-700">{permission.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowAddPermissionModal(false)}
                            className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddPermission}
                            className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3]"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </BaseModal>

            {/* Add User Modal */}
            <BaseModal
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                title="Add User"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">User ID</label>
                        <input
                            type="text"
                            name="userId"
                            value={userForm.userId}
                            onChange={handleUserFormChange}
                            placeholder="Type user Id"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleUserFormChange}
                            placeholder="Type Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                value={userForm.username}
                                onChange={handleUserFormChange}
                                placeholder="Enter Username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC] pr-10"
                            />
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Assigned By</label>
                        <input
                            type="text"
                            name="assignedBy"
                            value={userForm.assignedBy}
                            onChange={handleUserFormChange}
                            placeholder="Type Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC]"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
                        <div className="space-y-2">
                            {['Admin', 'Customer Support', 'Billing', 'Super Admin'].map((role) => (
                                <label key={role} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={userForm.role === role}
                                        onChange={handleUserFormChange}
                                        className="w-4 h-4 text-[#0066CC]"
                                    />
                                    <span className="text-gray-700">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Date Assigned</label>
                        <input
                            type="text"
                            name="dateAssigned"
                            value={userForm.dateAssigned}
                            onChange={handleUserFormChange}
                            placeholder="Choose Date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-700 text-[#343434] focus:outline-none focus:border-[#0066CC]"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowAddUserModal(false)}
                            className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddUser}
                            className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3]"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </BaseModal>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Success"
                message="Operation completed successfully"
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this item?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div >
    );
};

export default ManageRolesPage;