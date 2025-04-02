

export function getNameFromEmail(email: string): string {
    if (!email || !email.includes('@')) {
        return '';
    }

    // Get the part before the @ symbol
    const localPart = email.split('@')[0];
    
    // Replace common separators with spaces
    let name = localPart.replace(/[._-]/g, ' ');
    
    // Handle case where there are no separators by attempting to split camelCase
    if (!localPart.match(/[._-]/)) {
        name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    // Capitalize each word
    name = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    return name.trim();
}

