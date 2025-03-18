"use client"

import { type FC, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { format } from "timeago.js"
import { toast } from "react-hot-toast"
import { Trash2, Mail, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Search, SlidersHorizontal } from "lucide-react"

import { styles } from "@/app/style/style"
import Loader from "../../Loader/Loader"
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../../redux/features/user/userApi"

type Props = {
  isTeam?: boolean
}

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme()
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("admin")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectOpen, setSelectOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    role: true,
    courses: true,
    createdAt: true,
    actions: true
  })
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false)

  const [updateUserRole, { error: updateError, isSuccess, data: updateData }] = useUpdateUserRoleMutation()
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation({})
  const { isLoading, data, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any
        toast.error(errorMessage.data.message)
      }
    }

    if (isSuccess && updateData?.success) {
      refetch()
      toast.success("User role updated successfully")
      setAddMemberOpen(false)
      setChangeRoleDialogOpen(false)
    }
    if (deleteSuccess) {
      refetch()
      toast.success("Delete user successfully!")
      setDeleteDialogOpen(false)
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any
        toast.error(errorMessage.data.message)
      }
    }
  }, [updateError, isSuccess, updateData, deleteSuccess, deleteError, refetch])

  const handleSubmit = async () => {
    const userToUpdate = data?.users.find((user) => user.email === email)
    if (userToUpdate) {
      await updateUserRole({ id: userToUpdate._id, role })
    } else {
      toast.error("User not found with this email")
    }
  }

  const handleChangeRole = async () => {
    await updateUserRole({ id: userId, role })
  }

  const handleDelete = async () => {
    await deleteUser(userId)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort data
  const filteredData = isTeam 
    ? data?.users.filter((item: any) => {
        const matchesSearch = !searchTerm || Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        return item.role === "admin" && matchesSearch
      })
    : data?.users?.filter((item: any) => 
        !searchTerm || Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )

  // Sort data if sort field is set
  const sortedData = [...(filteredData || [])].sort((a: any, b: any) => {
    if (!sortField) return 0
    
    const aVal = sortField === 'courses' ? a.courses.length : a[sortField]
    const bVal = sortField === 'courses' ? b.courses.length : b[sortField]

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
  })

  // Calculate pagination
  const paginatedData = sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const totalPages = sortedData ? Math.ceil(sortedData.length / rowsPerPage) : 0

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setColumnSettingsOpen(!columnSettingsOpen)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Columns
              </button>
              {columnSettingsOpen && (
                <div className="absolute mt-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 z-50">
                  {Object.entries(visibleColumns).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
                      />
                      <span className="text-gray-700 dark:text-gray-300">{key}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {isTeam && (
              <button
                className="px-4 py-2 rounded-md bg-[#57c7a3] hover:bg-[#57c7a3]/90 text-white font-medium text-sm dark:border dark:border-[#ffffff6c]"
                onClick={() => setAddMemberOpen(true)}
              >
                Add New Member
              </button>
            )}
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b2e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-[#1e2134] text-gray-700 dark:text-white">
                  <tr>
                    {visibleColumns.id && (
                      <th 
                        className="px-4 py-3 text-left font-medium cursor-pointer"
                        onClick={() => handleSort('_id')}
                      >
                        <div className="flex items-center gap-2">
                          ID
                          <ArrowUpDown className={`h-4 w-4 ${sortField === '_id' ? 'text-blue-500' : ''}`} />
                        </div>
                      </th>
                    )}
                    {visibleColumns.name && (
                      <th 
                        className="px-4 py-3 text-left font-medium cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          <ArrowUpDown className={`h-4 w-4 ${sortField === 'name' ? 'text-blue-500' : ''}`} />
                        </div>
                      </th>
                    )}
                    {visibleColumns.email && (
                      <th 
                        className="px-4 py-3 text-left font-medium cursor-pointer"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          <ArrowUpDown className={`h-4 w-4 ${sortField === 'email' ? 'text-blue-500' : ''}`} />
                        </div>
                      </th>
                    )}
                    {visibleColumns.role && (
                      <th 
                        className="px-4 py-3 text-left font-medium cursor-pointer"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center gap-2">
                          Role
                          <ArrowUpDown className={`h-4 w-4 ${sortField === 'role' ? 'text-blue-500' : ''}`} />
                        </div>
                      </th>
                    )}
                    {visibleColumns.courses && (
                      <th 
                        className="px-4 py-3 text-left font-medium cursor-pointer"
                        onClick={() => handleSort('courses')}
                      >
                        <div className="flex items-center gap-2">
                          Purchased Courses
                          <ArrowUpDown className={`h-4 w-4 ${sortField === 'courses' ? 'text-blue-500' : ''}`} />
                        </div>
                      </th>
                    )}
                    {visibleColumns.createdAt && (
                      <th 
                        className="px-4 py-3 text-left font-medium cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-2">
                          Joined At
                          <ArrowUpDown className={`h-4 w-4 ${sortField === 'createdAt' ? 'text-blue-500' : ''}`} />
                        </div>
                      </th>
                    )}
                    {visibleColumns.actions && (
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData &&
                    paginatedData.map((user: any) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-[#1e2134]">
                        {visibleColumns.id && (
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user._id}</td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.name}</td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                        )}
                        {visibleColumns.role && (
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "admin"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                        )}
                        {visibleColumns.courses && (
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.courses.length}</td>
                        )}
                        {visibleColumns.createdAt && (
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{format(user.createdAt)}</td>
                        )}
                        {visibleColumns.actions && (
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                onClick={() => {
                                  setUserId(user._id)
                                  setRole(user.role === "admin" ? "user" : "admin")
                                  setChangeRoleDialogOpen(true)
                                }}
                                title="Change Role"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <a
                                href={`mailto:${user.email}`}
                                className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                title="Email User"
                              >
                                <Mail className="h-4 w-4" />
                              </a>
                              <button
                                className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                                onClick={() => {
                                  setUserId(user._id)
                                  setDeleteDialogOpen(true)
                                }}
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, sortedData?.length || 0)} of{" "}
                  {sortedData?.length || 0} entries
                </p>
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-[70px] px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    onClick={() => setSelectOpen(!selectOpen)}
                  >
                    {rowsPerPage}
                    <ChevronRight className={`h-4 w-4 transition-transform ${selectOpen ? "rotate-90" : ""}`} />
                  </button>

                  {selectOpen && (
                    <div className="absolute mt-1 w-[70px] rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                      {[5, 10, 20, 50].map((value) => (
                        <button
                          key={value}
                          className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setRowsPerPage(value)
                            setPage(0)
                            setSelectOpen(false)
                          }}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  className="p-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  className="p-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  className="p-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add Member Modal */}
          {addMemberOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6">
                  <h2 className={`${styles.title} mb-4`}>Add New Member</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Add a new team member by entering their email and selecting a role.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setAddMemberOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#57c7a3] hover:bg-[#57c7a3]/90 text-white rounded-md"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Change Role Modal */}
          {changeRoleDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6">
                  <h2 className={`${styles.title} mb-4`}>Change User Role</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {role === "admin"
                      ? "Are you sure you want to make this user an admin? They will have full access to the system."
                      : "Are you sure you want to remove admin privileges from this user?"}
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setChangeRoleDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#57c7a3] hover:bg-[#57c7a3]/90 text-white rounded-md"
                      onClick={handleChangeRole}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete User Modal */}
          {deleteDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6">
                  <h2 className={`${styles.title} mb-4`}>Delete User</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AllUsers