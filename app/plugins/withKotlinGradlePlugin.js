const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * expo-build-properties writes android.kotlinVersion into gradle.properties.
 * That updates rootProject.ext.kotlinVersion (stdlib / KSP) but the template
 * still loads kotlin-gradle-plugin with no version, so the compiler stays on
 * RN's 2.1.x and cannot read play-services-ads 25.4.0 (Kotlin 2.3 metadata).
 * Use 2.3.20 (not 2.3.21): Expo's pika-compiler 0.3.2 has no 2.3.21 artifact.
 */
function withKotlinGradlePlugin(config, { kotlinVersion = '2.3.20' } = {}) {
  return withProjectBuildGradle(config, (mod) => {
    const next = mod.modResults.contents.replace(
      /classpath\((['"])org\.jetbrains\.kotlin:kotlin-gradle-plugin\1\)/,
      `classpath($1org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}$1)`
    );
    if (next === mod.modResults.contents) {
      throw new Error(
        'withKotlinGradlePlugin: did not find classpath("org.jetbrains.kotlin:kotlin-gradle-plugin") in android/build.gradle'
      );
    }
    mod.modResults.contents = next;
    return mod;
  });
}

module.exports = withKotlinGradlePlugin;
