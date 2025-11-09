const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/40 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Your Company Name. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
