/**
 * Autobind decorator for class methods
 * This avoids the need for manual binding like method.bind(this)
 */
export function autobind(_: any, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // 'this' here refers to the instance
      const boundFunction = originalMethod.bind(this);
      
      // Cache the bound function on the instance to avoid creating a new function on each get
      Object.defineProperty(this, _propertyKey, {
        value: boundFunction,
        configurable: true,
        writable: true
      });
      
      return boundFunction;
    }
  };
  
  return adjustedDescriptor;
}

/**
 * Class decorator that autobinds all methods in a class
 */
export function autobinded<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      
      const prototype = constructor.prototype;
      const propertyNames = Object.getOwnPropertyNames(prototype);
      
      for (const name of propertyNames) {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
        
        // Skip constructor and properties that are not functions
        if (name === 'constructor' || !descriptor || typeof descriptor.value !== 'function') {
          continue;
        }
        
        // Apply autobind to all methods
        const boundMethod = descriptor.value.bind(this);
        Object.defineProperty(this, name, {
          value: boundMethod,
          configurable: true,
          writable: true
        });
      }
    }
  };
}