/**
 * Tests for Mission Control task board.
 * Daksha (दक्ष) — TDD for multi-agent coordination.
 */
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  initMissionControl, createTask, updateTask, queryTasks,
  sendMention, consumeMentions, registerAgent, generateWorkingMd,
  generateStandup, TaskStatus,
} from '../lib/mission-control.js';

let tmpDir;
let mcDir;

beforeEach(() => {
  tmpDir = mkdtempSync('/tmp/mc-test-');
  initMissionControl(tmpDir);
  mcDir = join(tmpDir, '.mission-control');
});

describe('initMissionControl', () => {
  test('creates directory structure', () => {
    assert.ok(existsSync(mcDir));
    assert.ok(existsSync(join(mcDir, 'board.json')));
    assert.ok(existsSync(join(mcDir, 'agents.json')));
  });
});

describe('createTask', () => {
  test('creates task with generated ID and default status', () => {
    const task = createTask(mcDir, { title: 'Test task' });
    assert.ok(task.id.startsWith('task-'));
    assert.equal(task.title, 'Test task');
    assert.equal(task.status, TaskStatus.INBOX);
  });

  test('assigns task and sets status to assigned', () => {
    const task = createTask(mcDir, { title: 'Assigned', assignee: 'vidura' });
    assert.equal(task.assignee, 'vidura');
    assert.equal(task.status, TaskStatus.ASSIGNED);
  });
});

describe('updateTask', () => {
  test('updates status and adds comment', () => {
    const task = createTask(mcDir, { title: 'Test' });
    const updated = updateTask(mcDir, task.id, {
      status: TaskStatus.IN_PROGRESS,
      comment: 'Working on it',
    }, 'vidura');
    assert.equal(updated.status, TaskStatus.IN_PROGRESS);
    assert.equal(updated.comments.length, 1);
    assert.equal(updated.comments[0].text, 'Working on it');
  });

  test('auto-subscribes updater', () => {
    const task = createTask(mcDir, { title: 'Test' });
    updateTask(mcDir, task.id, { comment: 'Hello' }, 'sudarshana');
    const updated = queryTasks(mcDir).find(t => t.id === task.id);
    assert.ok(updated.subscribers.includes('sudarshana'));
  });
});

describe('mentions', () => {
  test('send and consume mentions', () => {
    sendMention(mcDir, 'vidura', 'sudarshana', 'Need review');
    const mentions = consumeMentions(mcDir, 'sudarshana');
    assert.equal(mentions.length, 1);
    assert.equal(mentions[0].from, 'vidura');

    // Second consume returns empty (already read)
    const again = consumeMentions(mcDir, 'sudarshana');
    assert.equal(again.length, 0);
  });
});

describe('queryTasks', () => {
  test('filters by status', () => {
    createTask(mcDir, { title: 'A' });
    createTask(mcDir, { title: 'B', assignee: 'v' });
    const inbox = queryTasks(mcDir, { status: TaskStatus.INBOX });
    assert.equal(inbox.length, 1);
  });
});

describe('generateWorkingMd', () => {
  test('includes assigned tasks', () => {
    registerAgent(mcDir, { name: 'vidura', displayName: 'Vidura', emoji: '🧑‍⚖️' });
    createTask(mcDir, { title: 'Review code', assignee: 'vidura' });
    const md = generateWorkingMd(mcDir, 'vidura');
    assert.match(md, /Review code/);
    assert.match(md, /Assigned to You/);
  });
});

describe('generateStandup', () => {
  test('produces standup with agent sections', () => {
    registerAgent(mcDir, { name: 'vidura', displayName: 'Vidura', emoji: '🧑‍⚖️' });
    const md = generateStandup(mcDir);
    assert.match(md, /Daily Standup/);
    assert.match(md, /Vidura/);
  });
});
