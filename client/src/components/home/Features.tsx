

const Features = () => {
  return (
    <div>
      {/* Features Section */}
      <div id="features" className="px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mt-8">
            Advanced Protection Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card mx-auto">
              <div className="card-inner rounded-xl shadow-lg shadow-black/50">
                {/* Front */}
                <div
                  className="card-front rounded-xl"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg')`,
                  }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">
                    AI Vision Detection
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Advanced computer vision algorithms identify and classify
                    different animal species with 99.8% accuracy in real-time.
                  </p>
                </div>

                {/* Back */}
                <div className="card-back rounded-xl bg-slate-900 text-white overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    AI Vision Detection Details
                  </h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Our AI-powered vision system uses deep learning models
                    trained on millions of animal images to achieve highly
                    reliable detection in diverse environments.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    ✅ Recognizes more than <b>500+ species</b>
                    <br />✅ Works in <b>low-light & night</b> conditions
                    <br />✅ Real-time processing at <b>30 FPS</b>
                    <br />✅ Designed for <b>24/7 surveillance</b>
                  </p>
                  <p className="text-sm leading-relaxed">
                    Ideal for farms, wildlife monitoring, and property
                    protection.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card mx-auto">
              <div className="card-inner rounded-xl shadow-lg shadow-black/50">
                {/* Front */}
                <div
                  className="card-front rounded-xl"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg')`,
                  }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Instant Alerts
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Receive immediate notifications via SMS, email, or mobile
                    app when potential threats are detected on your property.
                  </p>
                </div>

                {/* Back */}
                <div className="card-back rounded-xl bg-slate-900 text-white overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    Instant Alerts Details
                  </h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Get notified instantly through multiple channels including
                    SMS, email, push notifications, and even automated voice
                    calls.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    ✅ Works with smart home devices
                    <br />✅ Supports <b>customizable alert zones</b>
                    <br />
                    ✅ Can trigger lights, sirens, and emergency services
                    <br />✅ Fully configurable to your needs
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card mx-auto">
              <div className="card-inner rounded-xl shadow-lg shadow-black/50">
                {/* Front */}
                <div
                  className="card-front rounded-xl"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/163185/old-retro-antique-vintage-163185.jpeg')`,
                  }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Zone Mapping
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Create custom protection zones and set different alert
                    levels for various areas of your property.
                  </p>
                </div>

                {/* Back */}
                <div className="card-back rounded-xl bg-slate-900 text-white overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    Zone Mapping Details
                  </h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Define custom protection zones with different sensitivity
                    levels. High-risk areas can have instant alerts, while outer
                    zones can be less sensitive.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    ✅ Flexible <b>multi-zone setup</b>
                    <br />
                    ✅ Visual mapping interface
                    <br />
                    ✅ Different alert rules per zone
                    <br />✅ Easy to configure & monitor
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="card mx-auto">
              <div className="card-inner rounded-xl shadow-lg shadow-black/50">
                {/* Front */}
                <div
                  className="card-front rounded-xl"
                  style={{
                    backgroundImage: `url('https://miro.medium.com/0*1Pnnik3uKWKLifgJ')`,
                  }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Smart Detection
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Automated response systems including lights, sounds, and
                    safe deterrent mechanisms to protect without harm.
                  </p>
                </div>

                {/* Back */}
                <div className="card-back rounded-xl bg-slate-900 text-white overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    Smart Detection Details
                  </h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Beyond detection, our system includes intelligent response
                    mechanisms like ultrasonic sounds, flashing lights, and
                    water sprays.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    ✅ Non-lethal deterrents
                    <br />
                    ✅ Protects without harming wildlife
                    <br />
                    ✅ Learns and adapts over time
                    <br />✅ Reduces false alarms
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="card mx-auto">
              <div className="card-inner rounded-xl shadow-lg shadow-black/50">
                {/* Front */}
                <div
                  className="card-front rounded-xl"
                  style={{
                    backgroundImage: `url('https://www.shutterstock.com/shutterstock/videos/3461443233/thumb/10.jpg?ip=x480')`,
                  }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">
                    IoT Network
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Comprehensive sensor network including motion, thermal,
                    acoustic, and environmental monitoring devices.
                  </p>
                </div>

                {/* Back */}
                <div className="card-back rounded-xl bg-slate-900 text-white overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    IoT Network Details
                  </h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Comprehensive sensor ecosystem including PIR motion sensors,
                    thermal cameras, acoustic monitors, and environmental
                    sensors.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    ✅ Secure IoT communication
                    <br />
                    ✅ End-to-end encryption
                    <br />
                    ✅ Battery-powered options
                    <br />✅ Reliable even in remote areas
                  </p>
                </div>
              </div>
            </div>

            {/* Card 6  */}
            {/* Card 6 */}
            <div className="card mx-auto">
              <div className="card-inner rounded-xl shadow-lg shadow-black/50">
                {/* Front */}
                <div
                  className="card-front rounded-xl"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/8110357/pexels-photo-8110357.jpeg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <h3 className="text-xl font-bold mb-2 text-white">
                    24/7 Protection
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    Round-the-clock monitoring with cloud backup, ensuring your
                    property is always protected and data is secure.
                  </p>
                </div>

                {/* Back */}
                <div className="card-back rounded-xl bg-slate-900 text-white overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    24/7 Protection Details
                  </h3>
                  <p className="text-sm leading-relaxed mb-2">
                    Always-on security with cloud-based data storage, real-time
                    alerts, and smart monitoring to keep your property safe.
                  </p>
                  <p className="text-sm leading-relaxed mb-2">
                    ✅ Cloud backup support <br />
                    ✅ Real-time alerts <br />
                    ✅ Remote monitoring <br />✅ Tamper-resistant system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
