# Changelog

All notable changes to the Process Control Temperature application will be documented in this file.

## Model Tracking

**Purpose**: Each entry includes the underlying LLM model that made the change, so you can track which AI model implemented which features when switching between different models.

**How to use**:
- When adding new entries, include `*(Model: ModelName)*` after the change description
- Check Cursor's UI or model indicator to see which underlying model is being used (e.g., OpenAI GPT-4, Claude 3.5, Kimi K2, etc.)
- Examples: `*(Model: OpenAI GPT-4)*`, `*(Model: Claude 3.5 Sonnet)*`, `*(Model: Kimi K2)*`, `*(Model: Unknown/Auto)*`
- This helps identify which model's code style and approach was used for each feature

**Note**: The "Auto" label refers to Cursor's agent router system. The actual underlying model (OpenAI, Claude, etc.) should be noted based on what Cursor displays in the UI.

## [v0.0.3] - February 4, 2026

**Session Assistant**: Auto (Cursor AI Agent Router)  
**Underlying Model**: Claude 3.5 Sonnet  
**Date**: February 4, 2026

### Bug Fixes & Improvements
- **Fixed graph rendering issues with background fill effects** *(Model: Claude 3.5 Sonnet)*:
  - Removed gradient/shadow fill effects from all chart datasets (Manual, On/Off, PID modes)
  - Changed `backgroundColor` from gradient to `'transparent'`
  - Set `fill: false` on all datasets to prevent shadow artifacts
  - Charts now display clean lines without any fill under the curves
  
- **Improved graph initialization and mode switching** *(Model: Claude 3.5 Sonnet)*:
  - Added comprehensive canvas clearing before chart initialization
  - Charts are now fully cleared before switching between Manual, On/Off, and PID modes
  - Added `skipNextDataPoint` flag to avoid displaying stale hardware data after mode switches
  - First data point after mode switch is now skipped to ensure fresh hardware data
  
- **Enhanced chart dataset validation** *(Model: Claude 3.5 Sonnet)*:
  - Added safety checks to verify chart has correct number of datasets for current mode
  - Manual mode: Validates 2 datasets (Temperature, Power)
  - On/Off mode: Validates 4 datasets (Temperature, Target, Hysteresis, Power)
  - PID mode: Validates datasets based on control type (P=4, PI=5, PD=5, PID=6)
  
- **Improved PID control color scheme** *(Model: Claude 3.5 Sonnet)*:
  - Changed 'Output' color from red to white (#ffffff) for better visibility
  - Changed 'Proportional' color from orange to bright yellow (#f7e40c)
  - Changed 'Derivative' color from blue to cyan (#02e0c6)
  
- **Fixed target temperature input behavior** *(Model: Claude 3.5 Sonnet)*:
  - On/Off and PID target temperature inputs now only update when user finishes typing
  - Values update on Enter key press or when clicking outside the input box
  - Prevents unwanted updates while user is still typing
  
- **Fixed PID Fan Speed slider reference issues** *(Model: Claude 3.5 Sonnet)*:
  - Fan speed slider now re-queries DOM element to ensure correct reference
  - Prevents issues with slider not updating after certain actions

- **Added system status indicator to Admin Panel** *(Model: Claude 3.5 Sonnet)*:
  - Admin Panel now shows "SYSTEM ONLINE" / "SYSTEM OFFLINE" status
  - Matches the status indicator behavior from the main page
  - Uses same styling and color scheme (cyan for online, orange for offline)
  - Ensures both main page and admin panel display connection status

## [Unreleased] - 2024

**Session Assistant**: Auto (Cursor AI Agent Router)  
**Underlying Model**: Claude 3.5 Sonnet  
**Date**: December 2024 & February 2026

### New Features (February 3, 2026)

#### PID Data Reception and Debugging (Latest)
- **Added support for receiving PID values from hardware as separate JSON messages** *(Model: Claude 3.5 Sonnet)*:
  - **Purpose**: Hardware sends PID data (Pr, It, Dr, Ot) in a separate JSON message from main data (T, P, F)
  - **Implementation**:
    - `main.js`: Updated JSON parser to accept BOTH message types:
      - Type 1: Main data `{"T": 25.5, "P": 45.2, "F": 50}`
      - Type 2: PID data `{"Pr": 5.67, "It": 2.89, "Dr": 1.23, "Ot": 12.34}`
    - `renderer.js`: Added storage system to combine data from both messages
      - PID values stored in `lastPidValues` object when received
      - Main data message uses stored PID values for graph updates
  - **Comprehensive debugging logs added**:
    - Main process logs: `📥 JSON received`, `✅ JSON sent to renderer`, `⚠️ JSON rejected`
    - Renderer logs: `📥 JSON: {...}`, `🎯 PID Message Type Detected`, `📊 Main Data Message`
    - Graph update logs: `📈 Graph updated: Temp=X, Ot=X, Pr=X, It=X, Dr=X`
  - **Technical Details**:
    - Fixed issue where PID JSON was being rejected by main.js validator
    - Added console.log and addToLog calls for all JSON processing steps
    - Logs visible in browser console and Admin Panel system log
  - **Benefits**:
    - Easy debugging of JSON reception issues
    - Clear visibility of what data is being received and when
    - Separate handling of main data and PID data messages

#### PID Control Type Auto-Loading with Default Values
- **PID Control Type selection now automatically loads default values and sends all parameters to hardware** *(Model: Claude 3.5 Sonnet)*:
  - **Purpose**: When user selects a PID control type (P/PI/PD/PID) or switches to PID Control Mode, the system immediately loads appropriate default values and sends all three parameters (P, I, D) to the hardware.
  - **Default values by control type**:
    - **P Mode**: P=30, I=0, D=0 (user can edit P only)
    - **PI Mode**: P=12, I=0.1, D=0 (user can edit P and I)
    - **PD Mode**: P=12, I=0, D=220 (user can edit P and D)
    - **PID Mode**: P=12, I=0.1, D=220 (user can edit all three)
  - **Behavior**: 
    - Initial HTML values updated to show correct defaults (P=12, I=0.1, D=220 for PID mode)
    - Values are automatically populated in the input boxes
    - All three parameters (P, I, D) are immediately sent to hardware together when:
      - User selects a control type from the dropdown
      - User switches from Manual/On-Off mode to PID Control Mode
    - Even if some values are zero, they are still sent to ensure hardware is in correct state
    - User receives confirmation message in log showing all values sent
  - **Benefits**:
    - Provides sensible starting points for each control type
    - Ensures hardware is immediately in a known, working state when app first opens
    - Eliminates need for user to manually set initial values
    - Reduces chance of incorrect parameter combinations
    - Hardware receives correct PID parameters immediately upon mode switch
  - **Implementation**: 
    - Updated initial values in `index.html` to P=12, I=0.1, D=220
    - Modified PID control type change handler in `renderer.js` to set defaults and send all parameters together
    - Added code in `switchControlMode()` function to send PID values when switching to PID mode
    - Increased D value maximum to 500 to accommodate higher derivative values
  - **Result**: Selecting any control type or switching to PID mode instantly configures the system with working default values and sends them to hardware

#### Automatic System Reset on Connection
- **Added automatic initialization commands when hardware first connects** *(Model: Claude 3.5 Sonnet)*:
  - **Purpose**: Ensures the system always starts in a safe, known state when connecting to hardware for the first time.
  - **What happens on connection**:
    - Control mode is set to Manual (mode = 1)
    - Fan speed is set to 0% (fan off)
    - Power is set to 0% (heater off)
    - Heater is turned OFF
    - Graph is cleared automatically
    - All UI elements are updated to match the safe state
  - **Benefits**: 
    - Eliminates uncertainty about hardware state on connection
    - Provides consistent, predictable starting point for operation
    - Enhances safety by ensuring nothing is running until explicitly started
    - User has full control from a known safe state
  - **Implementation**: Modified `sendShutdownCommandsOnReconnect()` function to always send initialization commands instead of only when system was in unsafe state
  - **Result**: Every time you connect to the hardware, it starts fresh with everything turned off and in Manual mode

#### Automatic Safety Shutdown on App Close
- **Added comprehensive safety shutdown commands when closing the application** *(Model: Claude 3.5 Sonnet)*:
  - **Purpose**: Ensures the hardware is left in a completely safe state when the user closes the app, preventing any potential hazards or unwanted operation.
  - **What happens when closing the app**:
    1. Control mode is set to Manual (mode = 1)
    2. Fan speed is set to 0% (fan off)
    3. Power is set to 0% (heater off)
    4. Target temperature is set to 20°C (safe minimum)
    5. Heater is turned OFF
    6. PID P value is set to 0
    7. PID I value is set to 0
    8. PID D value is set to 0
  - **Safety mechanism**: 
    - Window close event is intercepted (`event.preventDefault()`)
    - All shutdown commands are sent with 200ms delays between each
    - Window only closes after all commands are successfully sent
    - If an error occurs, window still closes to prevent app hanging
  - **Benefits**: 
    - Complete hardware reset to safe state before disconnecting
    - No residual PID values or settings remain active
    - Hardware is left in a predictable, safe condition
    - Peace of mind when closing the application
  - **Logging**: All shutdown commands are logged to console with `[SHUTDOWN]` prefix for debugging
  - **Implementation**: Enhanced the window `close` event handler in `main.js` to send complete safety shutdown sequence
  - **Result**: When you close the app, the hardware is guaranteed to be in a completely safe, reset state with all values at 0 and control mode set to Manual

### Bug Fixes (February 3, 2026)

#### Control Mode Switching Safety Fix
- **Fixed heater and fan staying on when switching between control modes** *(Model: Claude 3.5 Sonnet)*:
  - **Root cause**: When switching between Manual/On-Off/PID modes, the `switchControlMode()` function was only updating the UI without sending safety shutdown commands to hardware. This could leave the heater on or fan running during mode transitions.
  - **Impact**: Potential safety hazard where heating elements or fans could remain active when switching modes, creating unreliable and potentially dangerous operation.
  - **Solution**: 
    - Added safety shutdown commands that are sent to hardware when switching modes:
      - Fan speed set to 0%
      - Heater mode set to OFF (0)
      - Target temperature set to 20°C (safe default)
      - Power set to 0% (for manual mode)
    - Added 100ms delays between commands to ensure proper hardware processing
    - Updated all UI elements (sliders, buttons, text boxes) to reflect the safe state:
      - Heater mode variable and buttons
      - Fan buttons and icons for Manual, On/Off, and PID modes
      - All slider fills and displays
    - All safety commands are logged for verification
  - **Result**: When switching control modes, the system always returns to a safe state (fan off, heater off, power 0, target temp 20°C), ensuring protection and reliability of the product.

#### PID Mode Chart Fixes
- **Fixed PID target temperature line not visible on graph** *(Model: Claude 3.5 Sonnet)*:
  - **Root cause**: The code was using `valuesArray13[11]` (hardware value) for the target temperature line instead of `pidTargetTemp` (the value set by the user with the slider).
  - **Impact**: Users could not see the target temperature line they set with the slider on the PID mode graph, making it difficult to monitor how the system was tracking the target.
  - **Solution**: 
    - Made `pidTargetTemp` a global variable (like `onoffTargetTemp`) so it's accessible to the `addPoint()` function
    - Updated both `chartData.series[1]` and `chartJsRef.data.datasets[1]` to use `pidTargetTemp` instead of `valuesArray13[11]`
    - Now the target temperature line correctly displays the value set by the user's slider in real-time

- **Set all PID secondary y-axis values to 0 as placeholders** *(Model: Claude 3.5 Sonnet)*:
  - Changed Output, Proportional, Integral, and Derivative values to 0 (they will come from hardware in the future)
  - Previously, Output was incorrectly using Power (valuesArray13[10]) as a placeholder
  - Updated comments to clarify these are placeholders that will receive data from hardware

### Performance Improvements (February 2, 2026)

#### Critical Performance Fix - Control Mode Switching Speed
- **Fixed 5-10 second delay when switching control modes** *(Model: Claude 3.5 Sonnet)*: 
  - **Root cause**: The `switchControlMode()` function was calling `setPower()`, `setOnOffTargetTemp()`, and `setPidTargetTemp()` functions which each sent multiple commands to hardware, causing cumulative delays. Additionally, a 100ms `setTimeout` verification was checking and potentially re-initializing charts multiple times.
  - **Impact**: Control mode changes (Manual/On-Off/PID) that used to be instant (fraction of a second) were taking 5-10 seconds or more to complete.
  - **Solution**: 
    - Removed all unnecessary hardware communication during mode switching - only the control mode command itself is sent
    - Eliminated the 100ms setTimeout chart verification loop that could re-initialize charts
    - Updated UI elements directly without calling functions that trigger hardware commands
    - Removed redundant fan speed reset commands (was resetting fan 3 times!)
  - **Result**: Control mode switching is now instant again (fraction of a second), matching the original performance

#### Code Cleanup and Optimization
- **Removed hysteresis monitor interval** *(Model: Claude 3.5 Sonnet)*: Eliminated continuous 100ms polling that was checking chart visibility unnecessarily. Hysteresis now updates naturally when target temperature or hysteresis value changes.
- **Optimized port polling** *(Model: Claude 3.5 Sonnet)*: Port polling now only runs when hardware is NOT connected, saving CPU cycles when device is already connected.
- **Cleaned up debug logging** *(Model: Claude 3.5 Sonnet)*:
  - renderer.js: Reduced console.log statements from 44 to 37
  - main.js: Removed ~12 debug console.log statements
  - Converted error handlers to silent errors where appropriate
- **Removed obsolete comments** *(Model: Claude 3.5 Sonnet)*: Deleted ~50-60 lines of "REMOVED" comment markers from previously deleted features (gauges, distance charts, T1-T8 sensors, etc.)

**Performance Impact**: Significant reduction in CPU usage, faster data processing, cleaner and more maintainable code.

### Fixed

#### Critical Chart Bug - Graph Lines Not Appearing (February 2, 2026)

- **Fixed missing X-axis labels causing all graph lines to disappear** *(Model: Unknown/Auto - check Cursor UI)*: 
  - **Root cause**: The `addPoint()` function was pushing data points to chart datasets but NEVER adding corresponding X-axis labels (timestamps). Without timestamps, Chart.js has no X-axis values to plot against, resulting in no visible graph lines despite data being present.
  - **Impact**: This bug affected ALL control modes (Manual, On/Off, and PID) - no graphs would display in any mode.
  - **Solution**: Added timestamp generation and `chart.data.labels.push(timeLabel)` to all three chart update sections in `addPoint()`:
    - On/Off mode: Added timestamp label before updating 4 datasets (Temperature, Target, Hysteresis, Power)
    - Manual mode: Added timestamp label before updating 2 datasets (Temperature, Power)
    - PID mode: Added timestamp label before updating datasets (varies by control type: P/PI/PD/PID)
  - **Additional fix**: Added initial timestamp label in `initChartForOnOff()` when creating the initial data point, ensuring the chart is visible immediately upon switching to On/Off mode

#### Power Control and Target Temperature Communication
- **Fixed Power Control not being sent to hardware** *(Model: Unknown/Auto - check Cursor UI)*: The Manual mode power slider now correctly sends power commands (`{"P": value}`) to the hardware via `window.electronAPI.sendPower()`. Previously, the power slider only updated the UI and converted power to heater temperature, but never sent the actual power command.
- **Fixed Target Temperature not being sent to hardware** *(Model: Unknown/Auto - check Cursor UI)*: 
  - On/Off mode target temperature slider now sends target temperature commands (`{"T": value}`) to hardware when changed
  - PID mode target temperature slider now sends target temperature commands to hardware when changed
  - Both modes use `window.electronAPI.sendHeaterTemp()` to send the target temperature
- **Fixed Hysteresis sending logic** *(Model: Unknown/Auto - check Cursor UI)*: Hysteresis value is now correctly sent to hardware when in On/Off mode (previously it was only sent in Manual mode, which was incorrect)

#### On/Off Mode Chart Display Issues
- **Fixed missing Hysteresis legend and line** *(Model: Unknown/Auto - check Cursor UI)*: The On/Off mode chart now correctly displays all 4 legend items:
  - Heater Temperature (blue line)
  - Target Temperature (pink line)
  - Hysteresis Low (orange dashed line)
  - Power (red line)
- **Fixed chart not updating in On/Off mode** *(Model: Unknown/Auto - check Cursor UI)*: 
  - Root cause: `handleJsonData()` was directly updating `chartJsRef` (Manual mode chart) instead of calling `addPoint()`, which routes data to the correct chart based on current mode
  - Solution: Modified `handleJsonData()` to call `addPoint()` instead of directly updating charts, ensuring data goes to `window.liveChartRef` (On/Off chart) when in On/Off mode
- **Fixed Manual mode chart overwriting On/Off chart** *(Model: Unknown/Auto - check Cursor UI)*: 
  - Added guards to prevent `initChartForManual()` from being called when `currentControlMode === 'onoff'`
  - Added protection in `addPoint()` to prevent wrong chart reinitialization
  - Added protection in `handleJsonData()` to prevent Manual chart initialization when in On/Off mode
- **Fixed target temperature variable scope** *(Model: Unknown/Auto - check Cursor UI)*: Made `onoffTargetTemp` and `onoffHysteresisValue` global variables so they're accessible to `addPoint()` function
- **Fixed target temperature source in chart updates** *(Model: Unknown/Auto - check Cursor UI)*: `handleJsonData()` now uses `onoffTargetTemp` (On/Off mode target) instead of `heaterTempInput` (Manual mode heater) when in On/Off mode

#### Chart Visibility and Data Updates
- **Added continuous monitor for hysteresis dataset** *(Model: Unknown/Auto - check Cursor UI)*: Created an interval monitor that checks every 100ms to ensure the hysteresis dataset stays visible in On/Off mode
- **Added legend click protection** *(Model: Unknown/Auto - check Cursor UI)*: Hysteresis dataset (index 2) cannot be hidden by clicking the legend - it's always forced to be visible
- **Added initial data points** *(Model: Unknown/Auto - check Cursor UI)*: On/Off chart now starts with valid initial data points for all 4 datasets to prevent Chart.js from hiding empty datasets
- **Added chart verification** *(Model: Unknown/Auto - check Cursor UI)*: Chart creation now verifies that all 4 datasets are created correctly and logs errors if something goes wrong

### Changed

- **Improved error handling** *(Model: Unknown/Auto - check Cursor UI)*: Added console logging and error messages to help debug chart initialization issues
- **Improved code organization** *(Model: Unknown/Auto - check Cursor UI)*: Separated chart update logic to use centralized `addPoint()` function instead of mode-specific direct updates

### Technical Details

#### Code Changes Summary
1. **renderer.js - Power Control (`setPower` function)**:
   - Added call to `window.electronAPI.sendPower(powerPercent)` to send power command to hardware
   - Power command is sent before heater mode/temperature commands

2. **renderer.js - Target Temperature (`setOnOffTargetTemp` and `setPidTargetTemp` functions)**:
   - Made both functions `async` and added calls to `window.electronAPI.sendHeaterTemp(tempCelsius)`
   - Target temperature is now sent to hardware when slider/buttons are changed

3. **renderer.js - Hysteresis (`onoffHysteresis` dropdown handler)**:
   - Changed condition from `currentControlMode === 'manual'` to `currentControlMode === 'onoff'`
   - Hysteresis is now sent when in On/Off mode (correct behavior)

4. **renderer.js - Chart Initialization (`initChartForOnOff` function)**:
   - Added initial data points to all 4 datasets
   - Added explicit visibility settings for hysteresis dataset
   - Added continuous monitor interval to keep hysteresis visible
   - Added chart verification and error logging

5. **renderer.js - Chart Updates (`handleJsonData` function)**:
   - Removed direct `chartJsRef` updates (was breaking On/Off mode)
   - Now calls `addPoint()` which routes to correct chart based on mode
   - Uses `onoffTargetTemp` when in On/Off mode instead of `heaterTempInput`

6. **renderer.js - Chart Protection (`initChartForManual` function)**:
   - Added guard to prevent Manual chart creation when in On/Off mode
   - Added check to prevent overwriting On/Off chart

7. **renderer.js - Global Variables**:
   - Moved `onoffTargetTemp` and `onoffHysteresisValue` to global scope (top of file)
   - Ensures these variables are accessible to `addPoint()` function

---

## Previous Versions

### Version 1.2.9
- Updated graph labels: "Linear Heater" renamed to "Heater Temperature" across all control modes for better clarity

### Version 1.2.8 and earlier
- Initial releases with Manual, On/Off, and PID control modes
- Serial/USB communication support
- Real-time data visualization
- Admin panel with bootloader support
- Auto-update functionality

---

## Notes

- All fixes maintain backward compatibility with existing functionality
- No breaking changes to the API or hardware communication protocol
- Chart.js library version and configuration remain unchanged

---

## Template for Future Entries

When adding new changes, use this format:

```markdown
## [Version X.Y.Z] - YYYY-MM-DD

**Session Assistant**: Auto (Cursor AI Agent Router)  
**Underlying Model**: [Check Cursor UI - e.g., OpenAI GPT-4, Claude 3.5 Sonnet, Kimi K2, etc.]  
**Date**: YYYY-MM-DD

### Added
- **New feature name** *(Model: OpenAI GPT-4)*: Description of what was added

### Fixed
- **Bug fix name** *(Model: Claude 3.5 Sonnet)*: Description of what was fixed

### Changed
- **Change name** *(Model: Kimi K2)*: Description of what was changed
```

**Remember**: 
- Always include `*(Model: ModelName)*` in each change entry to track which underlying LLM model made the modification
- Check Cursor's UI (usually in the chat header or settings) to see which model is currently active
- Common model names: OpenAI GPT-4, OpenAI GPT-3.5, Claude 3.5 Sonnet, Claude 3 Opus, Kimi K2, etc.
