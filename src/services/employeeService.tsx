import axiosInstance from './axiosInstance';

export interface Employee {
  user_id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  hire_date: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login_date: string;
  last_login_time: string;
  phone_number: string;
  groups: any[];
  user_permissions: any[];
}

export interface EmployeeCreate {
  first_name: string;
  last_name: string;
  phone_num: string | null; // Field name expected by backend
  role: string;
  hire_date: string;
  is_active?: boolean;
}

// Helper function to safely format phone numbers for API
const formatPhoneNumber = (phone: string | null): string | null => {
  if (!phone) return null;
  
  // Remove all non-numeric characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Ensure we're only sending digits to the API
  return digitsOnly || null;
};

export const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await axiosInstance.get('/employees/');
    return response.data;
  },
  
  createEmployee: async (employeeData: EmployeeCreate): Promise<Employee> => {
    try {
      // Process phone number to be numeric only for MySQL
      const processedData = {
        ...employeeData,
        phone_num: formatPhoneNumber(employeeData.phone_num || null)
      };
      
      const response = await axiosInstance.post('/auth/create-employee/', processedData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating employee:', error.response?.data || error.message);
      throw error;
    }
  }, 
  
  updateEmployeeStatus: async (userId: number, isActive: boolean): Promise<any> => {
    const response = await axiosInstance.patch(`/employees/${userId}/status/`, { is_active: isActive });
    return response.data;
  },

  updateEmployee: async (userId: number, employeeData: Partial<Employee>): Promise<any> => {
    // Handle phone number formatting - backend expects phone_num but UI uses phone_number
    const formattedData = {
      ...employeeData,
      phone_num: employeeData.phone_number ? formatPhoneNumber(employeeData.phone_number) : null
    };
    
    // Delete phone_number to avoid sending duplicate fields  
    delete formattedData.phone_number;
    
    const response = await axiosInstance.patch(`/employees/${userId}/update/`, formattedData);
    return response.data;
  },
  
  // Add the delete employee method
  deleteEmployee: async (userId: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/employees/${userId}/delete/`);
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  }
};