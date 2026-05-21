/**
 * Middleware to block requests from common API testing tools like Postman, Insomnia, etc.
 * It checks the User-Agent header and blocks known tool strings.
 */
export const blockApiTools = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';

  const blockedTools = [
    'PostmanRuntime',
    'insomnia',
    'python-requests',
    'curl',
    'Wget'
  ];

  const isBlocked = blockedTools.some(tool => 
    userAgent.toLowerCase().includes(tool.toLowerCase())
  );

  if (isBlocked) {
    return res.status(403).json({
      success: false,
      message: "Access denied. API testing tools are not allowed for security reasons."
    });
  }

  next();
};
