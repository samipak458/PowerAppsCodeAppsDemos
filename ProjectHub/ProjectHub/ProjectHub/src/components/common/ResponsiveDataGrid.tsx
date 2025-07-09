import React, { useMemo, useRef } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Skeleton,
  Card,
  Text,
  DataGrid,
  DataGridBody,
  DataGridRow,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  createTableColumn,
  TableCellLayout,
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuItem,
  ProgressBar,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';
import { 
  Edit20Regular, 
  Delete20Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  
  // Desktop table view
  desktopTable: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    '@media (max-width: 1200px)': {
      display: 'none',
    },
  },
  
  table: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  
  // Mobile card view
  mobileView: {
    display: 'none',
    '@media (max-width: 1200px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacingVerticalM,
      padding: tokens.spacingVerticalS,
    },
  },
  
  itemCard: {
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    '&:hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-1px)',
    },
  },
  
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalM,
  },
  
  cardField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '24px', // Ensure consistent height for skeleton rendering
  },
  
  cardLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
  },
  
  cardValue: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  
  cardActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: tokens.spacingVerticalS,
  },
  
  cardActionButton: {
    flex: 1,
    minHeight: '36px',
    fontSize: tokens.fontSizeBase300,
  },
  
  actionsContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    justifyContent: 'center',
  },
  
  // Progress bar styles
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    width: '100%',
    minHeight: '20px', // Ensure consistent height for skeleton rendering
  },
  
  progressBar: {
    flex: 1,
    minWidth: '60px',
  },
  
  progressText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightMedium,
    minWidth: '32px',
    textAlign: 'right',
  },
  
  // Skeleton styles
  skeletonBadge: {
    borderRadius: '12px',
    height: '24px',
    width: '80px',
    backgroundColor: tokens.colorNeutralBackground3,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: '0.8s',
      transitionTimingFunction: 'ease-in-out',
    },
  },
  
  skeletonText: {
    borderRadius: '4px',
    height: '16px',
    backgroundColor: tokens.colorNeutralBackground3,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: '0.8s',
      transitionTimingFunction: 'ease-in-out',
    },
  },
  
  skeletonButton: {
    borderRadius: '4px',
    height: '36px',
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: '0.8s',
      transitionTimingFunction: 'ease-in-out',
    },
  },
  
  skeletonActionButton: {
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    backgroundColor: tokens.colorNeutralBackground3,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: '0.8s',
      transitionTimingFunction: 'ease-in-out',
    },
  },
  
  skeletonProgressBar: {
    height: '8px',
    width: '100%',
    borderRadius: '4px',
    backgroundColor: tokens.colorNeutralBackground3,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: '0.8s',
      transitionTimingFunction: 'ease-in-out',
    },
  },
});

// Helper component for rendering progress bars
interface ProgressCellProps {
  value: number;
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ProgressCell: React.FC<ProgressCellProps> = ({ 
  value, 
  showPercentage = true, 
  size = 'medium' 
}) => {
  const styles = useStyles();
  const progressValue = Math.max(0, Math.min(100, value || 0));
  
  return (
    <div className={styles.progressContainer}>
      <ProgressBar 
        className={styles.progressBar}
        value={progressValue / 100}
        thickness={size === 'small' ? 'medium' : 'large'}
        color={progressValue >= 75 ? 'brand' : progressValue >= 50 ? 'success' : progressValue >= 25 ? 'warning' : 'error'}
      />
      {showPercentage && (
        <Text className={styles.progressText}>
          {Math.round(progressValue)}%
        </Text>
      )}
    </div>
  );
};

interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
  minWidth?: number;
  defaultWidth?: number;
  idealWidth?: number;
}

interface ResponsiveDataGridProps<T> {
  items: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSort?: (columnKey: keyof T, direction: 'asc' | 'desc') => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  mobileCardFields?: Array<{
    key: keyof T;
    label: string;
    render?: (value: unknown) => React.ReactNode;
  }>;
  keyField?: keyof T;
  customActions?: Array<{
    icon: React.ReactElement;
    label: string;
    onClick: (item: T) => void;
    appearance?: 'primary' | 'outline' | 'subtle';
  }>;
}

export function ResponsiveDataGrid<T extends Record<string, unknown> = Record<string, unknown>>({
  items,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  mobileCardFields = [],
  keyField = 'id' as keyof T,
  customActions = [],
}: ResponsiveDataGridProps<T>) {
  const styles = useStyles();
  const refMap = useRef<Record<string, HTMLElement | null>>({});
  
  // Create column sizing options for resizable columns
  const columnSizingOptions = useMemo(() => {
    const options: Record<string, { 
      minWidth?: number; 
      defaultWidth?: number; 
      idealWidth?: number;
      isResizable?: boolean;
    }> = {};
    
    columns.forEach((column) => {
      options[String(column.key)] = {
        minWidth: column.minWidth ?? 80,
        defaultWidth: column.defaultWidth ?? 120,
        idealWidth: column.idealWidth ?? 150,
        isResizable: true,  // Ensure column is resizable
      };
    });

    // Set actions column sizing if actions are provided
    if (onEdit || onDelete || customActions.length > 0) {
      const actionsCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + customActions.length;
      const actionsWidth = Math.max(120, actionsCount * 40 + 40); // Base width + button spacing
      options['actions'] = {
        minWidth: 100,
        defaultWidth: actionsWidth,
        idealWidth: actionsWidth,
        isResizable: true,
      };
    }

    return options;
  }, [columns, onEdit, onDelete, customActions]);
  
  // Create DataGrid columns with server-side sorting (no compare function)
  const dataGridColumns = useMemo(() => {
    const baseColumns: TableColumnDefinition<T>[] = columns.map((column) => 
      createTableColumn<T>({
        columnId: String(column.key),
        renderHeaderCell: () => column.header,
        renderCell: (item) => (
          <TableCellLayout truncate>
            {column.render 
              ? column.render(item[column.key], item)
              : String(item[column.key] || '')}
          </TableCellLayout>
        ),
      })
    );

    // Add actions column if edit/delete handlers or custom actions are provided
    if (onEdit || onDelete || customActions.length > 0) {
      const actionsColumn = createTableColumn<T>({
        columnId: 'actions',
        renderHeaderCell: () => 'Actions',
        renderCell: (item) => (
          <TableCellLayout truncate>
            <div className={styles.actionsContainer}>
              {customActions.map((action, index) => (
                <Button
                  key={index}
                  appearance={action.appearance || "subtle"}
                  icon={action.icon}
                  size="small"
                  aria-label={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(item);
                  }}
                />
              ))}
              {onEdit && (
                <Button
                  appearance="subtle"
                  icon={<Edit20Regular />}
                  size="small"
                  aria-label="Edit item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                />
              )}
              {onDelete && (
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  size="small"
                  aria-label="Delete item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                />
              )}
            </div>
          </TableCellLayout>
        ),
      });
      return [...baseColumns, actionsColumn];
    }

    return baseColumns;
  }, [columns, onEdit, onDelete, customActions, styles.actionsContainer]);

  // Create skeleton items based on column configuration
  const createSkeletonItems = (count: number): T[] => {
    return Array.from({ length: count }, (_, i) => {
      // Create a basic object with the key field only
      const skeletonItem: Record<string, unknown> = {
        [keyField]: `skeleton-${i}`
      };
      
      // Add placeholder values for each column
      columns.forEach(column => {
        const key = String(column.key);
        
        // Assign appropriate mock values based on column name patterns
        if (key.toLowerCase().includes('progress')) {
          skeletonItem[key] = 0;
        } else if (key.toLowerCase().includes('count')) {
          skeletonItem[key] = 0;
        } else if (key.toLowerCase().includes('date')) {
          skeletonItem[key] = '';
        } else if (key.toLowerCase().includes('status')) {
          skeletonItem[key] = '';
        } else {
          skeletonItem[key] = '';
        }
      });
      
      return skeletonItem as T;
    });
  };

  // Desktop view with resizable and sortable DataGrid
  const renderDesktopView = () => {
    // Create skeleton items for loading state - always use 10 rows to match default page size
    const displayItems = loading ? createSkeletonItems(10) : items;

    return (
      <div className={styles.desktopTable}>
        <div style={{ width: "100%" }}>
          <DataGrid
            items={displayItems}
            columns={dataGridColumns}
            resizableColumns
            sortable={!!onSort}
            columnSizingOptions={columnSizingOptions}
            getRowId={(item) => String(item[keyField])}
            style={{ minWidth: "600px", width: "100%", overflowX: "auto" }}
            size="medium"
            aria-label="Data grid with sortable and resizable columns"
          >
            <DataGridHeader style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <DataGridRow>
                {({ columnId, renderHeaderCell }, dataGrid) => {
                  const isSortable = !!onSort;
                  const sortDir = sortColumn === columnId ? 
                    (sortDirection === 'asc' ? 'ascending' : 'descending') : 
                    undefined;
                  
                  const handleSort = () => {
                    if (onSort) {
                      const key = String(columnId) as unknown as keyof T;
                      const newDirection = sortColumn === key && sortDirection === 'asc' ? 'desc' : 'asc';
                      onSort(key, newDirection);
                    }
                  };
                  
                  if (dataGrid.resizableColumns) {
                    return (
                      <Menu openOnContext>
                        <MenuTrigger>
                          <DataGridHeaderCell
                            ref={(el) => (refMap.current[columnId] = el)}
                            onClick={isSortable ? handleSort : undefined}
                            sortDirection={sortDir}
                            aria-sort={sortDir}
                            tabIndex={isSortable ? 0 : undefined}
                            role={isSortable ? "button" : undefined}
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (isSortable && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                handleSort();
                              }
                            }}
                          >
                            {renderHeaderCell()}
                          </DataGridHeaderCell>
                        </MenuTrigger>
                        <MenuPopover>
                          <MenuList>
                            <MenuItem
                              onClick={dataGrid.columnSizing_unstable.enableKeyboardMode(
                                columnId
                              )}
                            >
                              Keyboard Column Resizing
                            </MenuItem>
                          </MenuList>
                        </MenuPopover>
                      </Menu>
                    );
                  } else {
                    return (
                      <DataGridHeaderCell
                        onClick={isSortable ? handleSort : undefined}
                        sortDirection={sortDir}
                        aria-sort={sortDir}
                        tabIndex={isSortable ? 0 : undefined}
                        role={isSortable ? "button" : undefined}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (isSortable && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            handleSort();
                          }
                        }}
                      >
                        {renderHeaderCell()}
                      </DataGridHeaderCell>
                    );
                  }
                }}
              </DataGridRow>
            </DataGridHeader>
            
            <DataGridBody style={{ maxHeight: "500px", overflowY: "auto" }}>
              {({ item, rowId }) => (
                <DataGridRow key={rowId}>
                  {({ columnId, renderCell }) => (
                    <DataGridCell>
                      {loading ? (
                        <RenderSkeletonCell columnId={String(columnId)} />
                      ) : (
                        renderCell(item)
                      )}
                    </DataGridCell>
                  )}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        </div>
      </div>
    );
  };
  
  // Helper component to render appropriate skeleton based on column
  const RenderSkeletonCell = ({ columnId }: { columnId: string }) => {
    // Different skeleton styles based on column type
    if (columnId === 'actions') {
      return (
        <div className={styles.actionsContainer}>
          <Skeleton appearance="opaque" className={styles.skeletonActionButton} />
          <Skeleton appearance="opaque" className={styles.skeletonActionButton} />
        </div>
      );
    } 
    
    // For progress bars
    else if (columnId.toLowerCase().includes('progress')) {
      return (
        <div className={styles.progressContainer}>
          <Skeleton appearance="opaque" className={styles.skeletonProgressBar} />
          <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '30px' }} />
        </div>
      );
    } 
    
    // For status badges
    else if (columnId.toLowerCase().includes('status')) {
      return (
        <Skeleton appearance="opaque" className={styles.skeletonBadge} />
      );
    } 
    
    // For date fields
    else if (columnId.toLowerCase().includes('date')) {
      return (
        <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '80px' }} />
      );
    } 
    
    // For number fields
    else if (
      columnId.toLowerCase().includes('count') || 
      columnId.toLowerCase().includes('hours') || 
      columnId.toLowerCase().includes('budget')
    ) {
      return (
        <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '40px' }} />
      );
    } 
    
    // Default text skeleton
    else {
      // First column (usually name) gets slightly wider skeleton
      const width = columnId === String(columns[0]?.key) ? '80%' : '60%';
      return (
        <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width }} />
      );
    }
  };

  // Mobile view with improved skeleton cards
  const renderMobileView = () => (
    <div className={styles.mobileView}>
      {loading ? (
        // Skeleton cards with realistic field structure - always use 10 rows to match default page size
        Array.from({ length: 10 }).map((_, i) => (
          <Card key={`skeleton-card-${i}`} className={styles.itemCard}>
            <div className={styles.cardContent}>
              {/* Render skeleton fields that match the mobileCardFields structure */}
              {mobileCardFields.map((field, fieldIndex) => (
                <div key={`skeleton-field-${i}-${fieldIndex}`} className={styles.cardField}>
                  <Text className={styles.cardLabel}>{field.label}:</Text>
                  {/* Different skeleton styles based on field type */}
                  {field.key.toString().toLowerCase().includes('status') ? (
                    <Skeleton appearance="opaque" className={styles.skeletonBadge} />
                  ) : fieldIndex === 0 ? (
                    // First field (usually name) gets a wider skeleton
                    <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '80%' }} />
                  ) : field.key.toString().toLowerCase().includes('date') ? (
                    <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '80px' }} />
                  ) : field.key.toString().toLowerCase().includes('progress') ? (
                    <div className={styles.progressContainer}>
                      <Skeleton appearance="opaque" className={styles.skeletonProgressBar} />
                      <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '30px' }} />
                    </div>
                  ) : (
                    <Skeleton appearance="opaque" className={styles.skeletonText} style={{ width: '60%' }} />
                  )}
                </div>
              ))}
              
              {/* Skeleton action buttons */}
              {(onEdit || onDelete || customActions.length > 0) && (
                <div className={styles.cardActions}>
                  {customActions.map((_, index) => (
                    <Skeleton key={index} appearance="opaque" className={styles.skeletonButton} />
                  ))}
                  {onEdit && (
                    <Skeleton appearance="opaque" className={styles.skeletonButton} />
                  )}
                  {onDelete && (
                    <Skeleton appearance="opaque" className={styles.skeletonButton} />
                  )}
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        items.map((item) => (
          <Card key={String(item[keyField])} className={styles.itemCard}>
            <div className={styles.cardContent}>
              {mobileCardFields.map((field) => (
                <div key={String(field.key)} className={styles.cardField}>
                  <Text className={styles.cardLabel}>{field.label}:</Text>
                  <Text className={styles.cardValue}>
                    {field.render 
                      ? field.render(item[field.key])
                      : String(item[field.key] || '')}
                  </Text>
                </div>
              ))}
              
              {(onEdit || onDelete || customActions.length > 0) && (
                <div className={styles.cardActions}>
                  {customActions.map((action, index) => (
                    <Button
                      key={index}
                      className={styles.cardActionButton}
                      appearance={action.appearance || "outline"}
                      icon={action.icon}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(item);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                  {onEdit && (
                    <Button
                      className={styles.cardActionButton}
                      appearance="outline"
                      icon={<Edit20Regular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      className={styles.cardActionButton}
                      appearance="outline"
                      icon={<Delete20Regular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {renderDesktopView()}
      {renderMobileView()}
    </div>
  );
}
