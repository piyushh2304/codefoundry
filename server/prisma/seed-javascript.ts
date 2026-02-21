import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Adding JavaScript snippets...');

    const js = await prisma.language.upsert({
        where: { slug: 'javascript' },
        update: {},
        create: {
            name: 'JavaScript',
            slug: 'javascript',
            icon: 'javascript-icon',
        },
    });

    const categories = [
        { name: 'Performance', slug: 'performance' },
        { name: 'Functional Programming', slug: 'functional-programming' },
        { name: 'Object Handling', slug: 'object-handling' },
        { name: 'Async Patterns', slug: 'async-patterns' },
        { name: 'Data Structures', slug: 'data-structures' },
        { name: 'Error Handling', slug: 'error-handling' },
        { name: 'Meta Programming', slug: 'meta-programming' },
        { name: 'Event System', slug: 'event-system' },
        { name: 'Generators', slug: 'generators' },
    ];

    const categoryMap: Record<string, string> = {};

    for (const cat of categories) {
        const createdCat = await prisma.category.upsert({
            where: {
                languageId_slug: {
                    languageId: js.id,
                    slug: cat.slug,
                },
            },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                languageId: js.id,
            },
        });
        categoryMap[cat.slug] = createdCat.id;
    }

    const snippets = [
        {
            title: 'Generic Memoization',
            description: 'A higher-order function that caches the results of function calls based on their arguments.',
            categorySlug: 'performance',
            code: `const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Usage
const add = (a, b) => a + b;
const memoAdd = memoize(add);`,
        },
        {
            title: 'Measure Execution Time',
            description: 'A wrapper function to log the time taken by a function to execute.',
            categorySlug: 'performance',
            code: `const measureTime = (fn) => {
  return (...args) => {
    console.time("Execution Time");
    const result = fn(...args);
    console.timeEnd("Execution Time");
    return result;
  };
};`,
        },
        {
            title: 'Function Currying',
            description: 'Transforms a function with multiple arguments into a sequence of functions, each taking a single argument.',
            categorySlug: 'functional-programming',
            code: `const curry = (fn) => 
  function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...next) => curried(...args, ...next);
  };

// Usage
const multiply = (a, b) => a * b;
const curriedMultiply = curry(multiply);
curriedMultiply(2)(3);`,
        },
        {
            title: 'Function Composition (Compose & Pipe)',
            description: 'Combine multiple functions into a single function, executing them from right-to-left (compose) or left-to-right (pipe).',
            categorySlug: 'functional-programming',
            code: `const compose = (...fns) => 
  (value) => fns.reduceRight((acc, fn) => fn(acc), value);

const pipe = (...fns) =>
  (value) => fns.reduce((acc, fn) => fn(acc), value);`,
        },
        {
            title: 'Deep Freeze (Immutable Object)',
            description: 'Recursively freezes an object and its nested properties to make it truly immutable.',
            categorySlug: 'object-handling',
            code: `const deepFreeze = (obj) => {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      (typeof obj[prop] === "object" || typeof obj[prop] === "function")
    ) {
      deepFreeze(obj[prop]);
    }
  });

  return Object.freeze(obj);
};`,
        },
        {
            title: 'Safe Optional Access',
            description: 'Retrieve a value from a nested object path safely without using the optional chaining operator (?.).',
            categorySlug: 'object-handling',
            code: `const get = (obj, path, defaultValue) => {
  const keys = path.split(".");
  let result = obj;

  for (let key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }

  return result;
};`,
        },
        {
            title: 'Limit Concurrent Promises (Promise Pool)',
            description: 'Executes a list of asynchronous tasks with a limit on how many can run concurrently.',
            categorySlug: 'async-patterns',
            code: `const promisePool = async (tasks, limit) => {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = task().then((res) => {
      executing.splice(executing.indexOf(p), 1);
      return res;
    });

    results.push(p);
    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
};`,
        },
        {
            title: 'Promise Timeout Wrapper',
            description: 'Wraps a promise with a timeout, rejecting if the promise does not resolve within the specified time.',
            categorySlug: 'async-patterns',
            code: `const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );

  return Promise.race([promise, timeout]);
};`,
        },
        {
            title: 'LRU Cache (Least Recently Used)',
            description: 'A simple Least Recently Used (LRU) cache implementation using a Map.',
            categorySlug: 'data-structures',
            code: `class LRUCache {
  constructor(limit = 5) {
    this.limit = limit;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.limit) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
        },
        {
            title: 'Custom AppError Class',
            description: 'An extended Error class for handling operational errors with status codes.',
            categorySlug: 'error-handling',
            code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}`,
        },
        {
            title: 'Proxy Validation Layer',
            description: 'Using JavaScript Proxies to add a validation layer to objects.',
            categorySlug: 'meta-programming',
            code: `const user = new Proxy(
  {},
  {
    set(target, prop, value) {
      if (prop === "age" && typeof value !== "number") {
        throw new Error("Age must be a number");
      }
      target[prop] = value;
      return true;
    },
  }
);`,
        },
        {
            title: 'Advanced Event Bus',
            description: 'A simple publish-subscribe event system.',
            categorySlug: 'event-system',
            code: `class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((cb) => cb(data));
  }

  unsubscribe(event, callback) {
    this.events[event] =
      this.events[event]?.filter((cb) => cb !== callback) || [];
  }
}`,
        },
        {
            title: 'Infinite ID Generator',
            description: 'A generator function that yields a sequence of unique IDs.',
            categorySlug: 'generators',
            code: `function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
gen.next().value; // 1`,
        },
    ];

    for (const snippet of snippets) {
        const existingSnippet = await prisma.snippet.findFirst({
            where: {
                title: snippet.title,
                categoryId: categoryMap[snippet.categorySlug],
            },
        });

        if (existingSnippet) {
            await prisma.snippet.update({
                where: { id: existingSnippet.id },
                data: {
                    description: snippet.description,
                    code: snippet.code.trim(),
                },
            });
        } else {
            await prisma.snippet.create({
                data: {
                    title: snippet.title,
                    description: snippet.description,
                    code: snippet.code.trim(),
                    categoryId: categoryMap[snippet.categorySlug],
                },
            });
        }
    }

    console.log('✅ JavaScript snippets added successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
