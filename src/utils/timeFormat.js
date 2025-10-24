// Format time for display with new decimal rules
export const formatTimeForDisplay = (timeString) => {
  if (!timeString) return 'No Time';
  
  const pattern = /^(\d{1,2}):([0-5]\d):([0-5]\d)\.(\d{3})$/;
  const match = timeString.match(pattern);
  
  if (!match) return timeString;
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const milliseconds = parseInt(match[4], 10);
  
  let result = '';
  
  if (hours > 0) {
    // Hours case: show HH:MM:SS.MMM (no change)
    result += hours + ':';
    result += minutes.toString().padStart(2, '0') + ':';
    result += seconds.toString().padStart(2, '0');
    if (milliseconds > 0) {
      result += '.' + milliseconds.toString().padStart(3, '0');
    }
  } else if (minutes > 0) {
    // Minutes case: show M:SS.d
    result += minutes + ':';
    result += seconds.toString().padStart(2, '0');
    
    if (minutes < 10) {
      // For times < 10 minutes: show one decimal (tenths)
      const tenths = Math.floor(milliseconds / 100);
      result += '.' + tenths;
    } else {
      // For times >= 10 minutes: show milliseconds if non-zero
      if (milliseconds > 0) {
        result += '.' + milliseconds.toString().padStart(3, '0');
      }
    }
  } else {
    // Seconds only case: show SS.dd (two decimals - hundredths)
    result += seconds.toString();
    const hundredths = Math.floor(milliseconds / 10);
    result += '.' + hundredths.toString().padStart(2, '0');
  }
  
  return result;
};