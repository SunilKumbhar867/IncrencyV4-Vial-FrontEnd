import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/home', title: 'Home', icon: 'mdi mdi-home', class: '', label: '', labelClass: '', extralink: false, submenu: []
  },
  {
    path: '/admin', title: 'Admin', icon: 'mdi mdi-account', class: 'has-arrow', label: '', labelClass: 'label label-rouded label-themecolor pull-right', extralink: false,
    submenu: [
      { path: '/admin/pwd-policy', title: 'Password Policy', icon: 'fa fa-key', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/master/set-all-parameter', title: 'Set All Parameter', icon: 'fa fa fa-clock-o', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
    ]
  },
  {
    path: '/master', title: 'Master', icon: 'mdi mdi-database', class: 'has-arrow', label: '', labelClass: 'label label-rouded label-themecolor pull-right', extralink: false,
    submenu: [
      {
        path: '/master/role', title: 'Role', icon: 'fa fa-user', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          { path: '/master/role/add-role', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/master/role/edit-role', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
      },
      {
        path: '/master/user', title: 'User', icon: 'fa fa-users', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          { path: '/master/user/add-user', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/master/user/manage-user', title: 'Manage', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
      },
      {
        path: '/master/department', title: 'Department', icon: 'fa fa-sitemap', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          { path: '/master/department/add-dept', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/master/department/edit-dept', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
      },
      {
        path: '/master/calibrationbox', title: 'Calibration Box', icon: 'fa fa-cubes', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          { path: '/master/calibrationbox/add-box', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/master/calibrationbox/edit-box', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/master/calibrationbox/viewbox', title: 'View', icon: 'fa fa-eye', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
      },
      {
        path: '/master/otherequipment', title: 'Equipments', icon: 'fa fa-wrench', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          {
            path: '/master/balance', title: 'Balance', icon: 'fa fa-balance-scale', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
              { path: '/master/balance/add-balance', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/balance/edit-balance', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/balance/view-balance', title: 'View', icon: 'fa fa-eye', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
            ]
          },
          {
            path: '/master/vernier', title: 'Vernier', icon: 'mdi mdi-format-paint', class: 'has-arrow vernier', label: '', labelClass: '', extralink: false, submenu: [
              { path: '/master/vernier/add-vernier', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/vernier/edit-vernier', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/vernier/view-vernier', title: 'View', icon: 'fa fa-eye', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
            ]
          },
          {
            path: '/master/otherequipment', title: 'Other', icon: 'fa fa-wrench', class: 'has-arrow vernier', label: '', labelClass: '', extralink: false, submenu: [
              { path: '/master/otherequipment/add-othereqp', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/otherequipment/edit-othereqp', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/otherequipment/view-othereqp', title: 'View', icon: 'fa fa-eye', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
            ]
          },

        ]
      },
      {
        path: '/master/media', title: 'Media', icon: 'fa fa-tint', class: '', label: '', labelClass: '', extralink: false, submenu: []
      },
      {
        path: '/master/stage', title: 'Stage', icon: 'fa fa-crosshairs', class: '', label: '', labelClass: '', extralink: false, submenu: []
      },
      // {
      //   path: '/master/bin-entry', title: 'Bin Entry', icon: 'fa fa-archive', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
      //     { path: '/master/bin-entry/add-bin-entry', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      //     { path: '/master/bin-entry/edit-bin-entry', title: 'Edit', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      //     { path: '/master/bin-entry/release-bin-entry', title: 'Release', icon: 'fa fa-unlock-alt', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
      //   ]
      // },
      {
        path: '/master/product', title: 'Product', icon: 'fa fa-flask', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          {
            path: '/master/product/tablet', title: 'Tablet', icon: 'fa fa-ban', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
              { path: '/master/product/tablet/add-tablet', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/product/tablet/manage-tablet', title: 'Manage', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
            ]
          },
          {
            path: '/master/product/capsule', title: 'Capsule', icon: 'mdi mdi-pill', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
              { path: '/master/product/capsule/add-capsule', title: 'Add', icon: 'fa fa-plus-circle', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
              { path: '/master/product/capsule/manage-capsule', title: 'Manage', icon: 'fa fa-pencil', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
            ]
          }

        ]
      },
    ]
  },
  {
    path: '/setting', title: 'Setting', icon: 'mdi mdi-settings', class: 'has-arrow', label: '', labelClass: '', extralink: false,
    submenu: [
      { path: '/setting/area-setting', title: 'Area Setting', icon: 'fa fa-home', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/setting/cubicle-setting', title: 'Cubicle Setting', icon: 'mdi mdi-cube', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      // { path: '/setting/alert-setting', title: 'Alert Setting', icon: 'fa fa-bell', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/setting/bin-setting', title: 'Bin Setting', icon: 'fa fa-archive', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
    ]
  },
  {
    path: '/calibration', title: 'Calibration', icon: 'mdi mdi-album', class: 'has-arrow', label: '', labelClass: '', extralink: false,
    submenu: [
      { path: '/calibration/precalibration', title: 'Precalibration', icon: 'fa fa-gear', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/calibration/recalibration', title: 'Recalibration', icon: 'fa fa-gears', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
    ]
  },
  {
    path: '/audit-trail', title: 'Audit Trail', icon: 'mdi mdi-timetable', class: 'has-arrow', label: '', labelClass: '', extralink: false,
    submenu: [
      { path: '/audit-trail/change-profile', title: 'Change Profile', icon: 'mdi mdi-account-convert', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/change-password', title: 'Change Password', icon: 'mdi mdi-account-key', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/set-all-parameter', title: 'Set All Parameter', icon: 'fa fa fa-clock-o', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/activity-log', title: 'Activity Log', icon: 'fa fa-calendar-check-o', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/unauthorized-login', title: 'Unauthorized Login', icon: 'mdi mdi-security', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/role', title: 'Roles', icon: 'fa fa-user', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/user', title: 'User', icon: 'fa fa-users', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/department', title: 'Department', icon: 'fa fa-sitemap', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/calibrationbox', title: 'Calibration Box', icon: 'fa fa-cubes', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/balance', title: 'Balance', icon: 'fa fa-balance-scale', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/vernier', title: 'Vernier', icon: 'mdi mdi-format-paint', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/audit-other-equipment', title: 'Equipment', icon: 'fa fa-wrench', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/machine', title: 'Machine', icon: 'fa fa-wrench', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/media', title: 'Media', icon: 'fa fa-tint', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/stage', title: 'Stage', icon: 'fa fa-crosshairs', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      // { path: '/audit-trail/bin-entry', title: 'Bin Entry', icon: 'fa fa-archive', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/product', title: 'Product', icon: 'fa fa-flask', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/area-setting', title: 'Area Setting', icon: 'mdi mdi-home', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/cubicle-setting', title: 'Cubicle Setting', icon: 'mdi mdi-cube', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      // { path: '/audit-trail/bin-setting', title: 'Bin Setting', icon: 'fa fa-archive', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      // { path: '/audit-trail/alert-setting', title: 'Alert Setting', icon: 'fa fa-bell', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      // { path: '/audit-trail/calibration', title: 'Calibration', icon: 'fa fa-bullseye', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/audit-trail/recalibration', title: 'Recalibration', icon: 'fa fa-gears', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
    ]
  },
  {
    path: '/report', title: 'Report', icon: 'mdi mdi-clipboard-text', class: 'has-arrow', label: '', labelClass: '', extralink: false,
    submenu: [
      { path: '/report/tablet', title: 'Tablet', icon: 'fa fa-ban', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/report/capsule', title: 'Capsule', icon: 'mdi mdi-pill', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/report/batch-summary', title: 'Batch Summary', icon: 'fa fa-calendar-check-o', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      { path: '/report/product-summary', title: 'Product Summary', icon: 'fa fa-flask', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
      {
        path: '/report/rpt-calibration', title: 'Calibration', icon: 'fa fa-bullseye', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          { path: '/report/rpt-calibration/balance', title: 'Balance', icon: 'fa fa-balance-scale', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/report/rpt-calibration/vernier', title: 'Vernier', icon: 'mdi mdi-format-paint', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
      },
      {
        path: '/report/bin-weighing', title: 'Bin Weighing', icon: 'fa fa-archive', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
          { path: '/report/bin-weighing/individual-bin', title: 'Individual Bin', icon: 'mdi mdi-cart', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
          { path: '/report/bin-weighing/bin-summary', title: 'Bin Summary', icon: 'mdi mdi-calendar-text', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
        ]
      },
    ]
  },
];

