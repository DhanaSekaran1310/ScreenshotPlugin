//
//  ScreenshotToggleModule.swift
//  ScreenshotPlugin
//
//  Created by DHANASEKARAN on 25/03/25.
//


import UIKit

@objc(ScreenshotToggleModule)
class ScreenshotToggleModule: NSObject {

  // Reference to the secure view
  private var secureView: UIView?
  
  @objc
  func toggleScreenshot(_ isEnabled: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let window = UIApplication.shared.windows.first else {
        reject("window_error", "Could not access the window", nil)
        return
      }
      
      if isEnabled {
        // Create a secure view that covers the entire window
        if self.secureView == nil {
          let secureView = UIView(frame: window.bounds)
          secureView.backgroundColor = .clear
          secureView.isUserInteractionEnabled = false
          secureView.tag = 999 // Assign a tag for identification
          secureView.layer.allowsGroupOpacity = false
          secureView.layer.opacity = 0.1 // Minimal opacity for security
          window.addSubview(secureView)
          self.secureView = secureView
        }
      } else {
        // Remove secure view if exists
        if let secureView = self.secureView {
          secureView.removeFromSuperview()
          self.secureView = nil
        }
      }
      
      // Collect device details
      let deviceDetails = self.getDeviceDetails(isScreenshotDisabled: isEnabled)
      resolve(deviceDetails)
    }
  }
  
  // Function to get device details
  private func getDeviceDetails(isScreenshotDisabled: Bool) -> [String: Any] {
    let device = UIDevice.current
    var deviceDetails = [String: Any]()
    
    // Device Info
    deviceDetails["deviceName"] = device.name
    deviceDetails["systemName"] = device.systemName
    deviceDetails["systemVersion"] = device.systemVersion
    deviceDetails["model"] = device.model
    
    // UUID (Vendor ID)
    if let uuid = device.identifierForVendor?.uuidString {
      deviceDetails["uuid"] = uuid
    } else {
      deviceDetails["uuid"] = "Unavailable"
    }
    
    // Screenshot Status
    deviceDetails["screenshotStatus"] = isScreenshotDisabled ? "Disabled" : "Enabled"
    
    // Public IP (Optional if needed, requires async fetch)
    deviceDetails["publicIP"] = getPublicIP()
    
    return deviceDetails
  }
  
  // Fetch Public IP Address (Synchronous for simplicity)
  private func getPublicIP() -> String {
    guard let url = URL(string: "https://api.ipify.org?format=json") else { return "Unavailable" }
    var publicIP = "Unavailable"
    
    let semaphore = DispatchSemaphore(value: 0)
    let task = URLSession.shared.dataTask(with: url) { data, response, error in
      if let data = data, 
         let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
         let ip = json["ip"] as? String {
        publicIP = ip
      }
      semaphore.signal()
    }
    task.resume()
    semaphore.wait()
    return publicIP
  }
}
