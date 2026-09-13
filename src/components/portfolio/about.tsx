import { AboutStory } from "./story";
import { Education } from "./education";
import { Skills } from "./skills";

export function About() {
  return (
    <section
      className="section"
      id="about"
      aria-labelledby="about-title"
      data-scene-scope=""
    >
      <div className="wrap intro-row" data-reading-anchor="">
        <h2 id="about-title">About</h2>
        <p className="about-lead">
          <strong>I&#8217;m a curious developer.</strong>
          <span>
            I like untangling complex problems and making software feel simple.
            I enjoy turning a complicated workflow into a clear next step.
            I&#8217;m always exploring how AI can help people build, learn, and
            stay organized.
          </span>
        </p>
      </div>
      <AboutStory />
      <div
        className="wrap about-support"
        id="after-about"
        data-reading-anchor=""
      >
        <Education />
        <div>
          <p className="about-closing">
            I like building tools people can rely on, refining the details that
            save them time, and sharing what I learn.
          </p>
          <Skills />
        </div>
      </div>
    </section>
  );
}
