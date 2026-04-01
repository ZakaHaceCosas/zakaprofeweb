/**
 * Source - https://stackoverflow.com/a/43819507
// Posted by EugenSunic, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-31, License - CC BY-SA 4.0
 */
export const yearSize: () => 365 | 366 = () =>
    new Date(new Date().getFullYear(), 1, 29).getDate() === 29 ? 366 : 365;
