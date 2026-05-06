# TODO List

This file contains a list of tasks, improvements, and potential enhancements for the Process Control Temperature application.

## High Priority

### Bug Fixes
- [ ] **Remove debug console.log statements**: Clean up all the debug logging added during troubleshooting (especially in `addPoint()`, `handleJsonData()`, and `setOnOffTargetTemp()`)
- [ ] **Test all control modes thoroughly**: Verify that Manual, On/Off, and PID modes all work correctly after the recent fixes
- [ ] **Verify hardware communication**: Test that all commands (power, target temperature, hysteresis, PID parameters) are correctly received by the hardware device
- [ ] **Test chart performance**: Ensure chart updates don't cause performance issues with high data rates

### Code Quality
- [ ] **Refactor chart initialization**: Consider consolidating chart creation logic to reduce code duplication between Manual, On/Off, and PID modes
- [ ] **Improve error handling**: Add more comprehensive error handling for hardware communication failures
- [ ] **Add input validation**: Validate all user inputs before sending to hardware (ranges, types, etc.)

## Medium Priority

### Features
- [ ] **Add chart export functionality**: Allow users to export chart data as images (PNG, JPG) or PDF
- [ ] **Improve chart zoom/pan**: Add interactive zoom and pan capabilities to the charts
- [ ] **Add data point tooltips**: Show detailed information when hovering over chart data points
- [ ] **Add chart preset views**: Allow users to save and load chart view configurations
- [ ] **Improve target temperature controls**: Add more preset buttons or allow custom preset values

### User Experience
- [ ] **Add visual feedback for hardware commands**: Show confirmation when commands are successfully sent to hardware
- [ ] **Improve connection status display**: Make connection status more prominent and informative
- [ ] **Add keyboard shortcuts**: Implement keyboard shortcuts for common actions (e.g., Ctrl+S to save data)
- [ ] **Improve mobile/tablet UI**: Optimize layout for smaller screens and touch interactions

### Documentation
- [ ] **Update README.md**: Add information about the recent fixes and improvements
- [ ] **Add user manual**: Create a comprehensive user guide explaining all features
- [ ] **Add developer documentation**: Document the code structure and architecture for future developers

## Low Priority

### Enhancements
- [ ] **Add data analysis tools**: Implement statistical analysis of temperature data (min, max, average, trends)
- [ ] **Add alarm/notification system**: Alert users when temperature goes outside safe ranges
- [ ] **Add data backup**: Automatically backup CSV data and settings
- [ ] **Add multi-language support**: Support for multiple languages in the UI
- [ ] **Add dark/light theme toggle**: Allow users to switch between themes
- [ ] **Improve chart animations**: Add smooth transitions when switching between modes
- [ ] **Add chart comparison mode**: Allow viewing data from multiple sessions side-by-side

### Technical Improvements
- [ ] **Optimize chart rendering**: Improve performance for charts with many data points
- [ ] **Add unit tests**: Implement automated testing for critical functions
- [ ] **Code cleanup**: Remove commented-out code and unused functions
- [ ] **Improve code comments**: Add more detailed comments explaining complex logic
- [ ] **Refactor global variables**: Consider using a state management pattern instead of global variables

### Hardware Integration
- [ ] **Add support for additional sensors**: Support for more temperature sensors if hardware supports it
- [ ] **Add firmware version detection**: Display and check firmware version compatibility
- [ ] **Add hardware diagnostics**: Implement diagnostic tools to test hardware communication

## Completed ✅

- [x] **Fixed Power Control not being sent to hardware** - Power commands now correctly sent via `sendPower()`
- [x] **Fixed Target Temperature not being sent to hardware** - Target temperature now sent in On/Off and PID modes
- [x] **Fixed Hysteresis sending logic** - Hysteresis now sent when in On/Off mode (not Manual mode)
- [x] **Fixed missing Hysteresis legend in On/Off mode** - All 4 legend items now display correctly
- [x] **Fixed chart not updating in On/Off mode** - Data now correctly routes to On/Off chart (`window.liveChartRef`)
- [x] **Fixed Manual chart overwriting On/Off chart** - Added guards to prevent wrong chart initialization
- [x] **Fixed target temperature variable scope** - Made `onoffTargetTemp` and `onoffHysteresisValue` global
- [x] **Fixed target temperature source in chart updates** - Chart now uses correct target temperature source based on mode
- [x] **Added chart visibility protection** - Hysteresis dataset cannot be hidden and is continuously monitored
- [x] **Added initial data points to charts** - Charts start with valid data to prevent Chart.js from hiding datasets

## Notes

- Items are organized by priority (High, Medium, Low)
- Completed items are moved to the "Completed" section
- This list should be reviewed and updated regularly
- Feel free to add new items as needed
