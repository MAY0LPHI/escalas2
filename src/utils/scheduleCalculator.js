/**
 * Calculate if an employee is working on a given date based on their shift cycle
 * @param {Date} startDate - Employee's shift start date
 * @param {Date} targetDate - Date to check
 * @param {string} shiftType - Type of shift (12x36, 6x1, 5x1)
 * @returns {boolean} - Whether the employee is working on the target date
 */
export const isWorkingOnDate = (startDate, targetDate, shiftType) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((target - start) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) return false;
  
  switch (shiftType) {
    case '12x36':
      // Works 1 day, off 1 day
      return daysDiff % 2 === 0;
    
    case '6x1':
      // Works 6 days, off 1 day
      return daysDiff % 7 !== 6;
    
    case '5x1':
      // Works 5 days, off 1 day
      return daysDiff % 6 !== 5;
    
    default:
      return false;
  }
};

/**
 * Calculate schedule for all employees for a given date
 * @param {Array} employees - List of employees
 * @param {Date} date - Date to generate schedule for
 * @returns {Array} - Schedule with positions filled
 */
export const calculateSchedule = (employees, date) => {
  const workingEmployees = [];
  const offDutyEmployees = [];
  const substituteEmployees = [];
  
  // Separate employees by status
  employees.forEach(employee => {
    if (employee.isSubstitute) {
      substituteEmployees.push(employee);
    } else if (isWorkingOnDate(employee.startDate, date, employee.shiftType)) {
      workingEmployees.push(employee);
    } else {
      offDutyEmployees.push(employee);
    }
  });
  
  // Group by position
  const positionGroups = {};
  workingEmployees.forEach(emp => {
    if (!positionGroups[emp.position]) {
      positionGroups[emp.position] = [];
    }
    positionGroups[emp.position].push({
      ...emp,
      isCovering: false
    });
  });
  
  // Find positions that need coverage (employees off duty)
  const positionsNeedingCoverage = {};
  offDutyEmployees.forEach(emp => {
    if (!emp.isSubstitute) {
      if (!positionsNeedingCoverage[emp.position]) {
        positionsNeedingCoverage[emp.position] = [];
      }
      positionsNeedingCoverage[emp.position].push(emp);
    }
  });
  
  // Auto-assign substitutes to positions needing coverage
  Object.keys(positionsNeedingCoverage).forEach(position => {
    const needsCoverage = positionsNeedingCoverage[position].length;
    const availableSubstitutes = substituteEmployees.filter(
      sub => sub.position === position && !sub.assigned
    );
    
    for (let i = 0; i < Math.min(needsCoverage, availableSubstitutes.length); i++) {
      const substitute = availableSubstitutes[i];
      substitute.assigned = true;
      
      if (!positionGroups[position]) {
        positionGroups[position] = [];
      }
      
      positionGroups[position].push({
        ...substitute,
        isCovering: true,
        coveringFor: positionsNeedingCoverage[position][i].name
      });
    }
  });
  
  // Convert to array format
  const schedule = [];
  Object.keys(positionGroups).forEach(position => {
    schedule.push({
      position,
      employees: positionGroups[position]
    });
  });
  
  // Add off-duty list
  schedule.push({
    position: 'Folga',
    employees: offDutyEmployees.map(emp => ({ ...emp, isOffDuty: true }))
  });
  
  return schedule;
};

/**
 * Get the next work date for an employee
 * @param {Date} startDate - Employee's shift start date
 * @param {Date} fromDate - Date to start checking from
 * @param {string} shiftType - Type of shift
 * @returns {Date} - Next work date
 */
export const getNextWorkDate = (startDate, fromDate, shiftType) => {
  const current = new Date(fromDate);
  current.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 30; i++) {
    if (isWorkingOnDate(startDate, current, shiftType)) {
      return current;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return null;
};

/**
 * Format date for display
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
