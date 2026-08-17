// This file is required by karma.conf.js and initializes the Angular testing
// environment. Spec file discovery is handled by the karma builder itself
// (see angular.json test.options.include, default **/*.spec.ts) — it no
// longer relies on a manual require.context() call here.

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
