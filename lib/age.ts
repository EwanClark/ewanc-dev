const BIRTHDATE = new Date('2012-03-04'); // March 4th, 2012

export function calculateAge(birthdate: Date = BIRTHDATE): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  // If birthday hasn't occurred this year yet, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

export function getAge(): number {
  return calculateAge();
}

