# Design red flags

Screen every candidate before choosing. A red flag is a reason to revise or reject the shape.

**Shallow module.** A large interface that hides little. Signs: callers coordinate several methods to do one thing, options expose internal stages, and learning the interface doesn't spare the caller from learning the implementation. A deep module (small interface, lots behind it) is not the same as a deep call chain, which scatters understanding across layers.

**Information leakage.** Several modules depend on the same internal decision, so changing it means coordinated edits. Re-exporting transport or wire types is leakage. Parse external data into domain types behind the interface, and keep storage schemas and framework objects private.

**Organized by time, not knowledge.** Separate load, validate, transform and save stages that each repeat the same representation and rules. Group code by the decisions it owns instead.

**Pass-through method.** A method that forwards the same arguments to another method of the same shape. Remove it, unless it adds policy or a real abstraction.

**Split ownership.** More than one module writes the same state or keeps its own copy. Give each piece of state one owner.

**Two ways to do one task.** An agent copies whichever way it finds first, so both keep spreading. Keep one, move the callers and delete the other in the same change.

**Importable internals.** If callers can import a module's internals, an agent will. Make them unreachable so an outside import fails the build.

**Hand-synced lists.** Two places list the same items and both must be edited to add one. Keep one list and derive the rest, or make the build fail when they disagree.
