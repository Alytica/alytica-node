# Alytica SDK

The Alytica SDK is a JavaScript/TypeScript client library for integrating with the Alytica analytics platform. This SDK allows you to track user events, identify users, and manage user identity aliasing in your applications.

## Installation

```bash
npm install alytica-node
# or
yarn add alytica-node
```

## Quick Start

```typescript
import { Alytica } from 'alytica-node';

// Initialize the SDK
const analytics = new Alytica({
  clientId: 'YOUR_CLIENT_ID',
  debug: true
});

// Track an event
analytics.track('Button Clicked', {
  buttonName: 'Sign Up',
  pageLocation: 'homepage'
});

// Identify a user
analytics.identify({
  $userId: 'user-123',
  properties: {
    name: 'John Doe',
    email: 'john@example.com'
  }
});
```

## Configuration

The SDK can be initialized with the following options:

```typescript
const analytics = new Alytica({
  clientId: 'YOUR_CLIENT_ID',           // Required
  clientSecret: 'YOUR_CLIENT_SECRET',   // Optional: For server-side use, otherwise uses CORS auth
  apiUrl: 'https://api.alytica.tech',   // Optional: Default is https://api.alytica.tech
  debug: false,                         // Optional: Enable debug logging
  processProfile: true                  // Optional: If true, all events create/update profiles if false then
});
```

## Core Methods

### Track Events

The `track` method allows you to record user actions or events.

```typescript
// Basic event tracking
analytics.track('Page Viewed');

// With properties
analytics.track('Product Added', {
  productId: 'prod-123',
  price: 29.99,
  currency: 'USD'
});

// With custom distinctId
analytics.track('Form Submitted', {
  formName: 'newsletter',
  distinctId: 'user-456'
});
```

### Identify Users

The `identify` method associates a user with their actions and traits.

```typescript
analytics.identify({
  $userId: 'user-123',
  properties: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    plan: 'premium',
    signupDate: '2023-04-15'
  }
});
```

### Alias Users

The `alias` method connects different identifiers for the same user.

```typescript
analytics.alias({
  $distinctId: 'anonymous-user-abc',
  $alias: 'user-123'
});
```

### Global Properties

You can set properties that will be included with all subsequent events.

```typescript
analytics.setGlobalProperties({
  appVersion: '1.2.3',
  platform: 'web',
  environment: 'production'
});
```

### Other Methods

```typescript
// Clear the current distinctId
analytics.clear();

// Process any queued events
analytics.ready();

// Manually flush the queue
analytics.flush();
```

## Advanced Usage




### Disabling Tracking

You can temporarily disable tracking:

```typescript
const analytics = new Alytica({
  clientId: 'YOUR_CLIENT_ID',
  disabled: true  // No events will be sent
});
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions for all methods and parameters.

## Debug Mode

Enable debug mode to see detailed logs of all events being sent:

```typescript
const analytics = new Alytica({
  clientId: 'YOUR_CLIENT_ID',
  debug: true
});
```

## License

[MIT License](LICENSE)