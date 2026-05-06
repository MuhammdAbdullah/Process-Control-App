
// Inject custom CSS to change slider thumb color
(function () {
    var style = document.createElement('style');
    style.innerHTML = `
        /* Manual Fan */
        #fanSpeed::-webkit-slider-thumb { background: #008cff !important; }
        #fanSpeed::-moz-range-thumb { background: #008cff !important; }
        
        /* On/Off Fan */
        #onoffFanSpeed::-webkit-slider-thumb { background: #008cff !important; }
        #onoffFanSpeed::-moz-range-thumb { background: #008cff !important; }
        
        /* PID Fan */
        #pidFanSpeed::-webkit-slider-thumb { background: #008cff !important; }
        #pidFanSpeed::-moz-range-thumb { background: #008cff !important; }
        
        /* Heater Temp (Manual) */
        #heaterTemp::-webkit-slider-thumb { background: #008cff !important; }
        #heaterTemp::-moz-range-thumb { background: #008cff !important; }
        
        /* PID Power */
        #pidPowerSlider::-webkit-slider-thumb { background: #008cff !important; }
        #pidPowerSlider::-moz-range-thumb { background: #008cff !important; }
        
        /* On/Off Target Temp */
        #onoffTargetSlider::-webkit-slider-thumb { background: #008cff !important; }
        #onoffTargetSlider::-moz-range-thumb { background: #008cff !important; }
        
        /* PID Target Temp */
        #pidTargetSlider::-webkit-slider-thumb { background: #008cff !important; }
        #pidTargetSlider::-moz-range-thumb { background: #008cff !important; }

        /* Generic class fallback if used */
        .slider::-webkit-slider-thumb { background: #008cff !important; }
        .slider::-moz-range-thumb { background: #008cff !important; }
        
        /* Also update the custom div icons if they exist and are being used as heads */
        .fan-thumb-icon { background: #008cff !important; }
        #fanThumbIcon, #onoffFanThumbIcon, #pidFanThumbIcon, #heaterThumbIcon {
            background-color: #008cff !important;
            border: 2px solid #005bb7 !important; /* Slightly darker border for contrast */
        }
    `;
    document.head.appendChild(style);
})();
