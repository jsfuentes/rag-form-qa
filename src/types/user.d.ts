interface User {
  id: string;
  type: string;

  email?: string;
  name?: string;
  picture?: string;
  phone?: string;
  ssn?: number;
  grade?: string;
  school_code?: number;
}

interface UserForm extends User {
  password: string;
  password_confirmation: string;
}
