import type { ComponentType } from "react";


// Gantt Link Types (used in add-link and update-link events)
export type GanttLinkType = 'e2s' | 's2s' | 'e2e' | 's2e';

/**
 * Combined Gantt event type - Generic interface for all Gantt events
 * Based on SVAR Gantt API Documentation
 */
export interface GanttEvent {
  /** The ID of the task or object related to the event */
  id: string | number;
  
  /** 
   * The task object with all its properties
   * Present in add-task, update-task events
   */
  task?: GanttTask & {
    /** The nesting level of a task in the tasks tree */
    level?: number;
    /** An array of child tasks if any */
    data?: GanttTask[];
    /** The name of the data field which should be unique for each control type */
    key?: string;
    /** Task name */
    text?: string;
    /** Task start date */
    start?: Date;
    /** Task end date */
    end?: Date;
    /** Task duration */
    duration?: number;
    /** Task progress value (0-100) */
    progress?: number;
    /** Parent task ID */
    parent?: string | number;
    /** Task type: 'task', 'summary' or 'milestone' */
    type?: 'task' | 'summary' | 'milestone';
  };
  
  /** Task name (direct property) */
  text?: string;
  /** Task start date (direct property) */
  start?: Date;
  /** Task end date (direct property) */
  end?: Date;
  /** Task duration (direct property) */
  duration?: number;
  /** Task progress value (direct property) */
  progress?: number;
  /** Parent task ID (direct property) */
  parent?: string | number;
  
  /** The number of units for date values to be changed */
  diff?: number;
  /** If true, marks that the task update is in progress */
  inProgress?: boolean;
  /** The name of an action that triggered the update */
  eventSource?: string;
  /** The task ID before or after which a new task will be added */
  target?: string | number;
  /** Where to place a task: 'before', 'after', or 'child' */
  mode?: 'before' | 'after' | 'child' | 'up' | 'down';
  
  /** Link information for link-related events */
  link?: {
    /** Source task ID */
    source: string | number;
    /** Target task ID */
    target: string | number;
    /** Link type: 'e2s' (end-to-start), 's2s' (start-to-start), 'e2e' (end-to-end), or 's2e' (start-to-end) */
    type: GanttLinkType;
  };
  
  /** For select-task: toggle selection */
  toggle?: boolean;
  /** For select-task: select a range of tasks */
  range?: boolean;
  /** For select-task: show the task */
  show?: boolean;
  /** For delete events: the ID of a source task that is deleted */
  source?: string | number;
  
  /** Allow additional properties that may be present in different event types */
  [key: string]: unknown;
}

/**
 * Gantt API interface based on SVAR documentation
 * https://docs.svar.dev/react/gantt/api/overview/methods_overview
 */
export interface GanttAPI {
  /** 
   * Add event handler 
   * @param event Event name to listen for
   * @param handler Event handler function
   */
  on: (event: string, handler: (event: GanttEvent) => void) => void;
  
  /**
   * Execute a Gantt command
   * @param command Command name to execute
   * @param params Command parameters
   */
  exec: (command: string, params?: unknown) => void;
  
  /**
   * Intercept an action to override default behavior
   * @param action Action name to intercept
   * @param handler Handler function that returns false to prevent default behavior
   */
  intercept?: (action: string, handler: (data: GanttEvent) => boolean | void) => void;
  
  /**
   * Get task data by ID
   * @param id Task ID
   * @returns Task object or null if not found
   */
  getTask?: (id: number) => GanttTask | null;
  
  /**
   * Get current Gantt data as serialized object
   * @returns Object with tasks and links arrays
   */
  serialize?: () => { data: GanttTask[], links: GanttLink[] };
}

// Gantt task interface based on SVAR documentation
export interface GanttTask {
  id: number;
  text: string;
  start: Date;
  end?: Date;
  duration?: number;
  progress: number;
  type?: 'task' | 'summary' | 'milestone';
  parent?: number;
  open?: boolean;
  lazy?: boolean;
  /**
   * @deprecated This field is no longer needed as we use refs to track the latest task data
   * Kept for backward compatibility with the wx-react-gantt library
   */
  custom_data?: {
    [key: string]: unknown;
  };
}

// Gantt link interface for task dependencies
export interface GanttLink {
  id: number;
  source: number;
  target: number;
  type: 'e2s' | 's2s' | 'e2e' | 's2e'; // end-to-start, start-to-start, end-to-end, start-to-end
}

// Gantt column configuration
export interface GanttColumn {
  id: string;
  header: string;
  flexgrow?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

// Gantt scale configuration
export interface GanttScale {
  unit: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
  format: string;
  css?: string;
}
// Gantt component props interface
export interface GanttProps {
  /** Initialization function called when Gantt is ready */
  init?: (api: GanttAPI) => void;
  
  /** Array of tasks to display */
  tasks?: GanttTask[];
  
  /** Array of links between tasks */
  links?: GanttLink[];
  
  /** Column configuration for the task list */
  columns?: GanttColumn[];
  
  /** Zoom configuration */
  zoom?: GanttZoomConfig;
  
  /** General configuration object */
  config?: {
    /** Auto-schedule tasks */
    autoSchedule?: boolean;
    /** Show grid lines */
    grid?: boolean;
    /** Show tooltip */
    tooltip?: boolean;
    /** Enable task editing */
    editable?: boolean;
    /** Enable task creation */
    creatable?: boolean;
    /** Enable task deletion */
    deletable?: boolean;
    /** Additional configuration options */
    [key: string]: unknown;
  };
  
  /** CSS class name */
  className?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
  
  /** Additional props */
  [key: string]: unknown;
}

  // Main Gantt component export
  export const Gantt: ComponentType<GanttProps>;

