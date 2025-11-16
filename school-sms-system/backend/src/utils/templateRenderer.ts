export function renderTemplate(template: string, variables: Record<string, string>): string {
  let message = template;
  for (const key in variables) {
    message = message.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
  }
  return message;
}