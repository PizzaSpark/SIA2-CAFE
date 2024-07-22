export const pageAccessRules = {
    '/dashboard': ['Admin', 'Owner', 'Staff'],
    '/users': ['Admin', 'Owner'],
    '/stocks': ['Admin', 'Owner'],
    '/menu': ['Admin', 'Owner'],
    '/recipe': ['Admin', 'Owner'],
    '/order': ['Admin', 'Owner', 'Staff', 'Customer'],
    '/savemore': ['Admin', 'Owner'],
    '/auditlog': ['Admin', 'Owner', 'Staff'],
    '/projects': ['Admin', 'Owner', 'Staff', 'Customer'],
  };