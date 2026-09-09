/// <mls fileReference="_102036_/l2/environmentContract.test.ts" enhancement="_blank"/>

import test from 'node:test';
import assert from 'node:assert/strict';
import { environment, setEnvironment } from '/_102036_/l2/environmentContract.js';

test('default notifications without capability return null', async () => {
    setEnvironment({});
    const result = await environment.notifications.getPushSubscriptionForBackend();
    assert.equal(result, null);
});
