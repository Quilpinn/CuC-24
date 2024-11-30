import Cookies from 'js-cookie'

  export function setAuthentication(hash) {
    Cookies.set('auth', hash, {
      expires: 1,  // expires in 1 day
      path: '/',   // cookie is available for whole site
      secure: true,  // only transmitted over HTTPS
      sameSite: 'strict'  // CSRF protection
    })
  }
  
  // Reading a cookie
  export function getAuthentication() {
    const value = Cookies.get('auth')
    return value
  }

  export function isAuthenticated() {
    try {
        const value = Cookies.get('auth');
        return value != null;
    }
    catch {
        return false;
    }
    
  }
  
  // Removing a cookie
  export function removeAuthentication() {
    Cookies.remove('auth')
  }